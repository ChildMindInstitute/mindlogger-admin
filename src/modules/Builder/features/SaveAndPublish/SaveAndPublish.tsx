import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Svg } from 'shared/components/Svg';
import {
  AppletPasswordPopup,
  AppletPasswordPopupType,
  AppletPasswordRefType,
} from 'modules/Dashboard';
import { SaveAndPublishProcessPopup } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup';
import { SaveChangesPopup } from 'modules/Builder/components';
import { Mixpanel } from 'shared/utils';

import { StyledButton } from './SaveAndPublish.styles';
import { useSaveAndPublishSetup } from './SaveAndPublish.hooks';
import { SaveAndPublishProps } from './SaveAndPublish.types';

export const SaveAndPublish = ({ hasPrompt, setIsFromLibrary }: SaveAndPublishProps) => {
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
  } = useSaveAndPublishSetup(hasPrompt, setIsFromLibrary);
  const { appletId } = useParams();

  const handlePasswordSubmit = (ref?: AppletPasswordRefType) => {
    handleAppletPasswordSubmit(ref?.current?.password).then(() =>
      Mixpanel.track('handleAppletPasswordSubmit'),
    );
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
