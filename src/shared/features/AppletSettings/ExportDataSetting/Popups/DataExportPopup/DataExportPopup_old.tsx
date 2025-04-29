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

import { DataExportPopupProps, ExecuteAllPagesOfExportData, Modals } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportPopup.types';
import { useCheckIfHasEncryption } from 'modules/Dashboard/features/Respondents/Popups/Popups.hooks';
import { ChosenAppletData } from 'modules/Dashboard/features/Respondents/Respondents.types';
import { getExportDataSuffix, getFormattedToDate } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportPopup.utils';

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

        const dateType = getValues?.().dateType;
        const formFromDate = getValues?.().fromDate;
        const fromDate = formFromDate && format(formFromDate, DateFormats.shortISO);
        const formToDate = getValues?.().toDate;
        const toDate = getFormattedToDate({ dateType, formToDate });

        const body = {
          appletId,
          targetSubjectIds,
          fromDate,
          toDate,
        };
        const firstPageResponse = await getExportDataApi(body);
        const { result: firstPageData, count = 0 } = firstPageResponse.data;
        const pageLimit = getExportPageAmount(count);

        await exportEncryptedDataSucceed({
          getDecryptedAnswers,
          suffix: pageLimit > 1 ? getExportDataSuffix(1) : '',
          filters,
          flags: featureFlags,
        })(firstPageData);

        if (pageLimit > 1) {
          for (let page = 2; page <= pageLimit; page++) {
            setRequestedPage({
              currentPage: page,
              limit: pageLimit,
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
    [featureFlags, filters, getDecryptedAnswers, getValues, handlePopupClose],
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
          title={t('dataExport')}
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
          title={t('dataExport')}
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
