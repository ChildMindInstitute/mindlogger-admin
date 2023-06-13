import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { MutableRefObject } from 'react';

import { AppletPasswordRef, Svg } from 'shared/components';
import { AppletPasswordPopup, AppletPasswordPopupType } from 'modules/Dashboard';
import { SaveAndPublishProcessPopup } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup';
import { SaveChangesPopup } from 'modules/Builder/components';
import { Encryption } from 'shared/utils';

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
    appletEncryption,
    setIsPasswordPopupOpened,
    handleSaveAndPublishFirstClick,
    handleAppletPasswordSubmit,
    handlePublishProcessOnClose,
    handlePublishProcessOnRetry,
    handleSaveChangesDoNotSaveSubmit,
    handleSaveChangesSaveSubmit,
    cancelNavigation,
  } = useSaveAndPublishSetup(hasPrompt);
  const { appletId } = useParams();

  const handlePasswordSubmit = (
    encryption?: Encryption,
    ref?: MutableRefObject<AppletPasswordRef | null>,
  ) => {
    handleAppletPasswordSubmit(encryption, ref?.current?.password);
    setIsPasswordPopupOpened(false);
  };

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
        appletId={appletId ?? ''}
        onClose={() => setIsPasswordPopupOpened(false)}
        popupType={isNewApplet ? AppletPasswordPopupType.Create : AppletPasswordPopupType.Enter}
        popupVisible={isPasswordPopupOpened}
        submitCallback={handlePasswordSubmit}
        encryption={appletEncryption}
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
