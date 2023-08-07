import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EnterAppletPassword, Modal } from 'shared/components';
import {
  StyledBodyLarge,
  StyledLinearProgress,
  StyledModalWrapper,
  theme,
  variables,
} from 'shared/styles';
import { getExportDataApi } from 'api';
import { falseReturnFunc, exportDataSucceed } from 'shared/utils';
import { useAsync, useSetupEnterAppletPassword } from 'shared/hooks';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

import { DataExportPopupProps, Modals } from './DataExportPopup.types';
import { AppletsSmallTable } from '../../AppletsSmallTable';
import { useCheckIfHasEncryption } from '../Popup.hooks';

export const DataExportPopup = ({
  popupVisible,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
}: DataExportPopupProps) => {
  const { t } = useTranslation('app');
  const [dataIsExporting, setDataIsExporting] = useState(false);
  const [activeModal, setActiveModal] = useState(Modals.DataExport);
  const { appletPasswordRef, submitForm } = useSetupEnterAppletPassword();

  const handleDataExportSubmit = async () => {
    if (dataIsExporting) {
      return;
    }
    const { appletId, respondentId } = chosenAppletData || {};

    if (appletId && respondentId) {
      setDataIsExporting(true);

      try {
        await execute({ appletId, respondentIds: respondentId });
      } catch {
        setActiveModal(Modals.ExportError);
        setDataIsExporting(false);
      }
    }
  };

  const hasEncryptionCheck = useCheckIfHasEncryption({
    appletData: chosenAppletData,
    callback: handleDataExportSubmit,
  });

  const showEnterPwdScreen = !!chosenAppletData && !dataIsExporting && !hasEncryptionCheck;
  const getDecryptedAnswers = useDecryptedActivityData(
    chosenAppletData?.appletId,
    chosenAppletData?.encryption,
  );

  const { execute, error } = useAsync(
    getExportDataApi,
    exportDataSucceed({
      getDecryptedAnswers,
      callback: () => {
        setDataIsExporting(false);
        handlePopupClose();
      },
    }),
    (error) => {
      console.warn(error);
      setDataIsExporting(false);
      setActiveModal(Modals.ExportError);
    },
    falseReturnFunc,
    [getDecryptedAnswers],
  );

  const handlePopupClose = () => {
    setChosenAppletData(null);
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
        >
          <StyledModalWrapper>
            <EnterAppletPassword
              ref={appletPasswordRef}
              appletId={chosenAppletData?.appletId ?? ''}
              encryption={chosenAppletData?.encryption}
              submitCallback={handleDataExportSubmit}
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
