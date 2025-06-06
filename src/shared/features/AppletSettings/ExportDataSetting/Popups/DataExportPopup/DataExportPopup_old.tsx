import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import get from 'lodash.get';
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';

import { Modal } from 'shared/components/Modal';
import { EnterAppletPassword } from 'shared/components/Password';
import {
  StyledBodyLarge,
  StyledLinearProgress,
  StyledModalWrapper,
  theme,
  variables,
} from 'shared/styles';
import {
  exportEncryptedDataSucceed,
  Mixpanel,
  sendLogFile,
  MixpanelEventType,
  MixpanelProps,
} from 'shared/utils';
import { useFeatureFlags, useSetupEnterAppletPassword } from 'shared/hooks';
import { getExportDataApi } from 'api';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { getExportPageAmount } from 'modules/Dashboard/api/api.utils';
import { DateFormats } from 'shared/consts';
import { ExportDataFormValues } from 'shared/features/AppletSettings/ExportDataSetting/ExportDataSetting.types';
import { workspaces } from 'shared/state';
import { ScheduleHistoryExporter } from 'shared/utils/exportData/exporters/ScheduleHistoryExporter';
import { FlowActivityHistoryExporter } from 'shared/utils/exportData/exporters/FlowActivityHistoryExporter';
import {
  DataExportPopupProps,
  ExecuteAllPagesOfExportData,
  Modals,
} from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportPopup.types';
import { useCheckIfHasEncryption } from 'modules/Dashboard/features/Respondents/Popups/Popups.hooks';
import { ChosenAppletData } from 'modules/Dashboard/features/Respondents/Respondents.types';
import {
  getExportDataSuffix,
  getFormattedToDate,
} from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportPopup.utils';

export const DataExportPopup = ({
  filters = {},
  popupVisible,
  isAppletSetting,
  setPopupVisible,
  chosenAppletData,
  handlePopupClose: providedCloseHandler,
  'data-testid': dataTestid,
}: DataExportPopupProps) => {
  const dataExportingRef = useRef(false);
  const { featureFlags } = useFeatureFlags();
  const { getValues } = useFormContext<ExportDataFormValues>() ?? {};
  const { t } = useTranslation('app');
  const { ownerId } = workspaces.useData() ?? {};
  const [dataIsExporting, setDataIsExporting] = useState(false);
  const [activeModal, setActiveModal] = useState(Modals.DataExport);
  const { appletPasswordRef, submitForm } = useSetupEnterAppletPassword();
  const [{ currentPage, limit }, setRequestedPage] = useState({
    currentPage: 1,
    limit: 1,
  });

  const appletId = get(chosenAppletData, isAppletSetting ? 'id' : 'appletId');
  const subjectId = isAppletSetting ? undefined : (chosenAppletData as ChosenAppletData)?.subjectId;
  const { encryption } = chosenAppletData ?? {};

  const handleDataExportSubmit = async () => {
    if (dataIsExporting || dataExportingRef.current || !appletId) {
      return;
    }

    await executeAllPagesOfExportData({ appletId, targetSubjectIds: subjectId });
  };

  const hasEncryptionCheck = useCheckIfHasEncryption({
    isAppletSetting,
    appletData: chosenAppletData,
    callback: handleDataExportSubmit,
  });

  const showEnterPwdScreen = !!chosenAppletData && !dataIsExporting && !hasEncryptionCheck;
  const getDecryptedAnswers = useDecryptedActivityData(appletId, encryption);

  const handlePopupClose = useCallback(() => {
    setPopupVisible(false);
    providedCloseHandler?.();
  }, [providedCloseHandler, setPopupVisible]);

  const handleRetry = () => {
    setActiveModal(Modals.DataExport);
    handleDataExportSubmit();
  };

  const executeAllPagesOfExportData = useCallback(
    async ({ appletId, targetSubjectIds }: ExecuteAllPagesOfExportData) => {
      try {
        dataExportingRef.current = true;
        setDataIsExporting(true);

        const {
          dateType,
          fromDate: formFromDate,
          toDate: formToDate,
          supplementaryFiles,
        } = getValues?.() ?? {};

        const fromDate = formFromDate && format(formFromDate, DateFormats.shortISO);
        const toDate = getFormattedToDate({ dateType, formToDate });

        const body = {
          appletId,
          targetSubjectIds,
          fromDate,
          toDate,
        };
        const firstPageResponse = await getExportDataApi(body);
        const { result: firstPageData, count: exportDataTotalCount = 0 } = firstPageResponse.data;
        const exportDataPages = getExportPageAmount(exportDataTotalCount);

        await exportEncryptedDataSucceed({
          getDecryptedAnswers,
          suffix: exportDataPages > 1 ? getExportDataSuffix(1) : '',
          filters,
          flags: featureFlags,
        })(firstPageData);

        if (exportDataPages > 1) {
          for (let page = 2; page <= exportDataPages; page++) {
            setRequestedPage({
              currentPage: page,
              limit: exportDataPages,
            });
            const nextPageResponse = await getExportDataApi({
              ...body,
              page,
            });
            const { result: nextPageData } = nextPageResponse.data;
            await exportEncryptedDataSucceed({
              getDecryptedAnswers,
              suffix: getExportDataSuffix(page),
              filters,
              flags: featureFlags,
            })(nextPageData);
          }
        }

        if (featureFlags.enableEmaExtraFiles) {
          if (supplementaryFiles.scheduleHistory) {
            if (ownerId) {
              let activityOrFlowIds: string[] | undefined;
              const subjectIds: Set<string> = new Set();

              // Both of these may be populated when exporting for a flow, but we only want the flow
              if (filters?.flowId) {
                activityOrFlowIds = [filters.flowId];
              } else if (filters?.activityId) {
                activityOrFlowIds = [filters.activityId];
              }

              if (targetSubjectIds) {
                subjectIds.add(targetSubjectIds);
              }

              if (filters?.targetSubjectId) {
                subjectIds.add(filters.targetSubjectId);
              }

              if (filters?.sourceSubjectId) {
                subjectIds.add(filters.sourceSubjectId);
              }

              await new ScheduleHistoryExporter(ownerId).exportData({
                appletId,
                fromDate,
                toDate,
                subjectIds: subjectIds.size > 0 ? Array.from(subjectIds) : undefined,
                activityOrFlowIds,
              });
            } else {
              console.warn(
                `No owner ID found for current workspace. Schedule history export skipped.`,
              );
            }
          }

          if (supplementaryFiles.flowHistory) {
            await new FlowActivityHistoryExporter(appletId).exportData({
              appletId,
              fromDate,
              toDate,
              flowIds: filters?.flowId ? [filters.flowId] : undefined,
            });
          }
        }

        handlePopupClose();
        Mixpanel.track({
          action: MixpanelEventType.ExportDataSuccessful,
          [MixpanelProps.AppletId]: appletId,
        });
      } catch (e) {
        const error = e as TypeError;
        console.warn('Error while export data', error);
        setActiveModal(Modals.ExportError);
        await sendLogFile({ error });
      } finally {
        dataExportingRef.current = false;
        setDataIsExporting(false);
      }
    },
    [featureFlags, filters, getDecryptedAnswers, getValues, handlePopupClose, ownerId],
  );

  useEffect(() => {
    setActiveModal(showEnterPwdScreen ? Modals.PasswordCheck : Modals.DataExport);
  }, [showEnterPwdScreen]);

  switch (activeModal) {
    case Modals.DataExport:
      return (
        <Modal
          open={popupVisible}
          onClose={handlePopupClose}
          title={t('dataExport.title')}
          buttonText=""
          data-testid={dataTestid}
        >
          <StyledModalWrapper>
            <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
              {t('waitForRespondentDataDownload')}
              {limit > 1 && (
                <>
                  <br />
                  <br />
                  {t('dataProcessing', {
                    percentages: Math.floor((currentPage / limit) * 100),
                  })}
                </>
              )}
            </StyledBodyLarge>
            <StyledLinearProgress />
          </StyledModalWrapper>
        </Modal>
      );
    case Modals.PasswordCheck:
      return (
        <Modal
          open={popupVisible}
          onClose={handlePopupClose}
          onSubmit={submitForm}
          title={t('enterAppletPassword')}
          buttonText={t('submit')}
          data-testid={`${dataTestid}-password`}
        >
          <StyledModalWrapper>
            <EnterAppletPassword
              ref={appletPasswordRef}
              appletId={appletId ?? ''}
              encryption={encryption}
              submitCallback={handleDataExportSubmit}
              data-testid={`${dataTestid}-enter-password`}
            />
          </StyledModalWrapper>
        </Modal>
      );
    case Modals.ExportError:
      return (
        <Modal
          open={popupVisible}
          onClose={handlePopupClose}
          onSubmit={handleRetry}
          title={t('dataExport.title')}
          buttonText={t('retry')}
          hasSecondBtn
          submitBtnColor="error"
          secondBtnText={t('cancel')}
          onSecondBtnSubmit={handlePopupClose}
          data-testid={`${dataTestid}-error`}
        >
          <StyledModalWrapper>
            <StyledBodyLarge sx={{ color: variables.palette.semantic.error }}>
              {t('exportFailed')}
            </StyledBodyLarge>
          </StyledModalWrapper>
        </Modal>
      );
  }
};
