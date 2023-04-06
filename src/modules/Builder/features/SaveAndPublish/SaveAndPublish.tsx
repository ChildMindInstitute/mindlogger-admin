import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { AppletPasswordPopup, AppletPasswordPopupType } from 'modules/Dashboard';
import { SaveAndPublishProcessPopup } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup';
import { SaveChangesPopup } from 'modules/Builder/components';

import { StyledButton } from './SaveAndPublish.styles';
import { useSaveAndPublishSetup } from './SaveAndPublish.hooks';
import { SaveAndPublishProps } from './SaveAndPublish.types';

export const SaveAndPublish = ({ hasPrompt }: SaveAndPublishProps) => {
  const { t } = useTranslation('app');
  const {
    isNewApplet,
    isPasswordPopupOpened,
    isPublishProcessPopupOpened,
    publishProcessStep,
    promptVisible,
    setIsPasswordPopupOpened,
    handleSaveAndPublishFirstClick,
    handleAppletPasswordSubmit,
    handlePublishProcessOnClose,
    handlePublishProcessOnRetry,
    handleSaveChangesDoNotSaveSubmit,
    handleSaveChangesSaveSubmit,
    cancelNavigation,
  } = useSaveAndPublishSetup(hasPrompt);

  return (
    <>
      <StyledButton
        variant="contained"
        startIcon={<Svg id="save" width={18} height={18} />}
        onClick={handleSaveAndPublishFirstClick}
      >
        {t('saveAndPublish')}
      </StyledButton>
      <AppletPasswordPopup
        onClose={() => setIsPasswordPopupOpened(false)}
        popupType={isNewApplet ? AppletPasswordPopupType.Create : AppletPasswordPopupType.Enter}
        popupVisible={isPasswordPopupOpened}
        submitCallback={handleAppletPasswordSubmit}
      />
      <SaveAndPublishProcessPopup
        isPopupVisible={isPublishProcessPopupOpened}
        step={publishProcessStep}
        onClose={handlePublishProcessOnClose}
        onRetry={handlePublishProcessOnRetry}
      />
      <SaveChangesPopup
        isPopupVisible={promptVisible}
        handleClose={cancelNavigation}
        handleDoNotSaveSubmit={handleSaveChangesDoNotSaveSubmit}
        handleSaveSubmit={handleSaveChangesSaveSubmit}
      />
    </>
  );
};
