import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';

import { Modal, EnterAppletPassword } from 'shared/components';
import { StyledModalWrapper, StyledBodyLarge, theme } from 'shared/styles';
import { useSetupEnterAppletPassword } from 'shared/hooks';
import { page } from 'resources';

import { ViewDataPopupProps } from './ViewDataPopup.types';
import { AppletsSmallTable } from '../../AppletsSmallTable';
import { useCheckIfHasEncryption } from '../Popups.hooks';

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
  const hasEncryptionCheck = useCheckIfHasEncryption({
    appletData: chosenAppletData,
    callback: handleSubmitCallback,
  });
  const showSecondScreen = !!chosenAppletData && !hasEncryptionCheck;
  const dataTestid = 'dashboard-respondents-view-data-popup';

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={submitForm}
      title={showSecondScreen ? t('enterAppletPassword') : t('viewData')}
      buttonText={showSecondScreen ? t('submit') : ''}
      data-testid={dataTestid}
    >
      <StyledModalWrapper>
        {showSecondScreen ? (
          <EnterAppletPassword
            ref={appletPasswordRef}
            appletId={chosenAppletData?.appletId}
            encryption={chosenAppletData?.encryption}
            submitCallback={handleSubmitCallback}
            data-testid={`${dataTestid}-enter-password`}
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
