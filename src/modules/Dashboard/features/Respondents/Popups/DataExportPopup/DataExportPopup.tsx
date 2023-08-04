import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EnterAppletPassword, Modal } from 'shared/components';
import {
  StyledBodyLarge,
  StyledErrorText,
  StyledLinearProgress,
  StyledModalWrapper,
  theme,
} from 'shared/styles';
import { getExportDataApi } from 'api';
import { falseReturnFunc, getErrorMessage, exportDataSucceed } from 'shared/utils';
import { useAsync, useSetupEnterAppletPassword } from 'shared/hooks';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

import { DataExportPopupProps } from './DataExportPopup.types';
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
  const { appletPasswordRef, submitForm } = useSetupEnterAppletPassword();

  const handleDataExportSubmit = async () => {
    if (dataIsExporting) {
      return;
    }
    const { appletId, respondentId } = chosenAppletData || {};

    if (appletId && respondentId) {
      setDataIsExporting(true);

      await execute({ appletId, respondentIds: respondentId });
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
    console.warn,
    falseReturnFunc,
    [getDecryptedAnswers],
  );

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };

  const renderModalContent = () => {
    if (showEnterPwdScreen) {
      return (
        <EnterAppletPassword
          ref={appletPasswordRef}
          appletId={chosenAppletData.appletId}
          encryption={chosenAppletData.encryption}
          submitCallback={handleDataExportSubmit}
        />
      );
    }
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
    if (error) {
      setDataIsExporting(false);
    }
  }, [error]);

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={submitForm}
      title={showEnterPwdScreen ? t('enterAppletPassword') : t('dataExport')}
      buttonText={showEnterPwdScreen ? t('submit') : ''}
    >
      <StyledModalWrapper>
        {renderModalContent()}
        {error && (
          <StyledErrorText sx={{ marginTop: theme.spacing(1) }}>
            {getErrorMessage(error)}
          </StyledErrorText>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
