import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { ShareApplet } from 'modules/Dashboard/features/Applet/ShareApplet';

import { ShareAppletPopupProps } from './ShareAppletPopup.types';

export const ShareAppletPopup = ({
  sharePopupVisible,
  setSharePopupVisible,
  applet,
}: ShareAppletPopupProps) => {
  const { t } = useTranslation('app');

  const [title, setTitle] = useState(t('shareTheAppletWithTheLibrary'));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [appletShared, setAppletShared] = useState(false);
  const [btnText, setBtnText] = useState(t('share'));

  useEffect(() => {
    if (appletShared) {
      setTitle(t('appletIsSharedWithLibrary'));
      setBtnText(t('ok'));
    }
  }, [appletShared]);

  const handleModalClose = () => setSharePopupVisible(false);

  const handleSubmit = () => {
    if (appletShared) {
      handleModalClose();
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <Modal
      open={sharePopupVisible}
      onClose={handleModalClose}
      onSubmit={handleSubmit}
      title={title || ''}
      buttonText={btnText || ''}
      disabledSubmit={isDisabled}
      width="60"
    >
      <ShareApplet
        applet={applet}
        onAppletShared={() => setAppletShared(true)}
        onDisableSubmit={setIsDisabled}
        isSubmitted={isSubmitted}
      />
    </Modal>
  );
};
