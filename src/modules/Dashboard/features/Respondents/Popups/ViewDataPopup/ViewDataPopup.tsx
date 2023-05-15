import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';

import { Modal, EnterAppletPassword } from 'shared/components';
import { StyledModalWrapper, StyledBodyLarge } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { useSetupEnterAppletPassword, useEncryptionCheckFromStorage } from 'shared/hooks';

import { page } from 'resources';
import { ViewDataPopupProps } from './ViewDataPopup.types';
import { AppletsSmallTable } from '../../AppletsSmallTable';

export const ViewDataPopup = ({
  popupVisible,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
}: ViewDataPopupProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { appletPasswordRef, submitForm } = useSetupEnterAppletPassword();
  const { getEncryptionCheck } = useEncryptionCheckFromStorage();
  const hasEncryptionCheck = getEncryptionCheck(chosenAppletData?.appletId ?? '');
  const showSecondScreen = !!chosenAppletData && !hasEncryptionCheck;

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };

  const handleSubmitCallback = () => {
    if (chosenAppletData) {
      const { appletId, respondentId } = chosenAppletData;
      navigate(generatePath(page.appletRespondentDataSummary, { appletId, respondentId }));
    }

    handlePopupClose();
  };

  useEffect(() => {
    const shouldSkipPassword = !!chosenAppletData && hasEncryptionCheck;
    shouldSkipPassword && handleSubmitCallback();
  }, [chosenAppletData, hasEncryptionCheck]);

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={submitForm}
      title={showSecondScreen ? t('enterAppletPassword') : t('viewData')}
      buttonText={showSecondScreen ? t('submit') : ''}
    >
      <StyledModalWrapper>
        {showSecondScreen ? (
          <EnterAppletPassword
            ref={appletPasswordRef}
            appletId={chosenAppletData?.appletId}
            encryption={chosenAppletData?.encryption}
            submitCallback={handleSubmitCallback}
          />
        ) : (
          <>
            <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
              {t('viewDataDescription')}
            </StyledBodyLarge>
            <AppletsSmallTable tableRows={tableRows} />
          </>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
