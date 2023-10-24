import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { EnterAppletPassword, Modal } from 'shared/components';
import {
  StyledBodyLarge,
  StyledLinearProgress,
  StyledModalWrapper,
  theme,
  variables,
} from 'shared/styles';
import { getExportDataApi } from 'api';
import { exportDataSucceed, Mixpanel, createArrayFromMinToMax } from 'shared/utils';
import { useSetupEnterAppletPassword } from 'shared/hooks';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { getPageAmount } from 'modules/Dashboard/api/api.utils';

import { DataExportPopupProps, Modals } from './DataExportPopup.types';
import { AppletsSmallTable } from '../../AppletsSmallTable';
import { useCheckIfHasEncryption } from '../Popup.hooks';
import { ChosenAppletData } from '../../Respondents.types';
import { getExportDataSuffix } from './DataExportPopup.utils';

export const DataExportPopup = ({
  popupVisible,
  isAppletSetting,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
  'data-testid': dataTestid,
}: DataExportPopupProps) => {
  const { t } = useTranslation('app');
  const [dataIsExporting, setDataIsExporting] = useState(false);
  const [activeModal, setActiveModal] = useState(Modals.DataExport);
  const { appletPasswordRef, submitForm } = useSetupEnterAppletPassword();
  const [{ currentPage, limit }, setRequestedPage] = useState({
    currentPage: 1,
    limit: 1,
  });

  const appletId = get(chosenAppletData, isAppletSetting ? 'id' : 'appletId');
  const respondentId = !isAppletSetting
    ? (chosenAppletData as ChosenAppletData)?.respondentId
    : undefined;
  const { encryption } = chosenAppletData ?? {};

  const handleDataExportSubmit = async () => {
    if (dataIsExporting) {
      return;
    }

    if (appletId) {
      setDataIsExporting(true);

      try {
        await executeAllPagesOfExportData({ appletId, respondentIds: respondentId });

        Mixpanel.track('Export Data Successful');
      } catch {
        setActiveModal(Modals.ExportError);
        setDataIsExporting(false);
      }
    }
  };

  const hasEncryptionCheck = useCheckIfHasEncryption({
    isAppletSetting,
    appletData: chosenAppletData,
    callback: handleDataExportSubmit,
  });

  const showEnterPwdScreen = !!chosenAppletData && !dataIsExporting && !hasEncryptionCheck;
  const getDecryptedAnswers = useDecryptedActivityData(appletId, encryption);

  const executeAllPagesOfExportData = useCallback(
    async ({
      appletId,
      respondentIds: respondentId,
    }: {
      appletId: string;
      respondentIds?: string;
    }) => {
      try {
        const firstPageResponse = await getExportDataApi({
          appletId,
          respondentIds: respondentId,
        });
        const { result: firstPageData, count = 0 } = firstPageResponse.data;
        const pageLimit = getPageAmount(count);
        await exportDataSucceed({
          getDecryptedAnswers,
          suffix: pageLimit > 1 ? getExportDataSuffix(1) : '',
        })(firstPageData);

        if (pageLimit > 1) {
          for (let page = 2; page <= pageLimit; page++) {
            setRequestedPage({
              currentPage: page,
              limit: pageLimit,
            });
            const nextPageResponse = await getExportDataApi({
              appletId,
              respondentIds: respondentId,
              page,
            });
            const { result: nextPageData } = nextPageResponse.data;
            await exportDataSucceed({
              getDecryptedAnswers,
              suffix: getExportDataSuffix(page),
            })(nextPageData);
          }
        }

        setDataIsExporting(false);
        handlePopupClose();
      } catch (error) {
        console.warn(error);
        setDataIsExporting(false);
        setActiveModal(Modals.ExportError);
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
    setDataIsExporting(true);
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
          onSubmit={submitForm}
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
