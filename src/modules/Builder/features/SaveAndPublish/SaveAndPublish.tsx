import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { SaveChangesPopup } from 'modules/Builder/components';
import { SaveAndPublishProcessPopup } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup';
import {
  AppletPasswordPopup,
  AppletPasswordPopupType,
  AppletPasswordRefType,
} from 'modules/Dashboard/features/Applet/Popups';
import { Svg } from 'shared/components/Svg';
import { Mixpanel } from 'shared/utils/mixpanel';

import { useSaveAndPublishSetup } from './SaveAndPublish.hooks';
import { StyledButton } from './SaveAndPublish.styles';

export const SaveAndPublish = () => {
  const { t } = useTranslation('app');

  const {
    isPasswordPopupOpened,
    isPublishProcessPopupOpened,
    publishProcessStep,
    promptVisible,
    appletEncryption,
    setIsPasswordPopupOpened,
    handleSaveAndPublishFirstClick,
    handleAppletPasswordSubmit,
    handlePublishProcessOnClose,
    handlePublishProcessOnRetry,
    handleSaveChangesDoNotSaveSubmit,
    handleSaveChangesSaveSubmit,
    cancelNavigation,
  } = useSaveAndPublishSetup();
  const { appletId } = useParams();

  const handlePasswordSubmit = (ref?: AppletPasswordRefType) => {
    handleAppletPasswordSubmit(ref?.current?.password).then(() => Mixpanel.track('Password added successfully'));
    setIsPasswordPopupOpened(false);
  };

  return (
    <>
      <StyledButton
        variant="contained"
        startIcon={<Svg id="save" width={18} height={18} />}
        onClick={handleSaveAndPublishFirstClick}
        data-testid="builder-save-and-publish"
      >
        {t('saveAndPublish')}
      </StyledButton>
      <AppletPasswordPopup
        appletId={appletId ?? ''}
        onClose={() => setIsPasswordPopupOpened(false)}
        popupType={AppletPasswordPopupType.Create}
        popupVisible={isPasswordPopupOpened}
        submitCallback={handlePasswordSubmit}
        encryption={appletEncryption}
        data-testid="builder-save-and-publish-password-popup"
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
        data-testid="builder-save-and-publish-save-changes-popup"
      />
    </>
  );
};
