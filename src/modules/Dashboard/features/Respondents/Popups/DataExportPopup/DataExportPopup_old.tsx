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
import { exportEncryptedDataSucceed, Mixpanel, sendLogFile } from 'shared/utils';
import { useSetupEnterAppletPassword } from 'shared/hooks';
import { getExportDataApi } from 'api';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { getExportPageAmount } from 'modules/Dashboard/api/api.utils';
import { DateFormats } from 'shared/consts';
import { ExportDataFormValues } from 'shared/features/AppletSettings/ExportDataSetting/ExportDataSetting.types';

import { DataExportPopupProps, ExecuteAllPagesOfExportData, Modals } from './DataExportPopup.types';
import { AppletsSmallTable } from '../../AppletsSmallTable';
import { useCheckIfHasEncryption } from '../Popups.hooks';
import { ChosenAppletData } from '../../Respondents.types';
import { getExportDataSuffix, getFormattedToDate } from './DataExportPopup.utils';

export const DataExportPopup = ({
  filters = {},
  popupVisible,
  isAppletSetting,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
  'data-testid': dataTestid,
}: DataExportPopupProps) => {
  const dataExportingRef = useRef(false);
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
            })(nextPageData);
          }
        }

        handlePopupClose();
        Mixpanel.track('Export Data Successful', {
          'Applet ID': appletId,
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
    [getDecryptedAnswers],
  );

  const handlePopupClose = () => {
    setChosenAppletData?.(null);
    setPopupVisible(false);
  };
  const handleRetry = () => {
    setActiveModal(Modals.DataExport);
    handleDataExportSubmit();
  };

  const renderDataExportContent = () => {
    if (dataIsExporting) {
      return (
        <>
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
        </>
      );
    }

    return (
      <>
        <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
          {t('selectAppletToExportRespondentsData')}
        </StyledBodyLarge>
        <AppletsSmallTable tableRows={tableRows} />
      </>
    );
  };

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
          <StyledModalWrapper>{renderDataExportContent()}</StyledModalWrapper>
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
