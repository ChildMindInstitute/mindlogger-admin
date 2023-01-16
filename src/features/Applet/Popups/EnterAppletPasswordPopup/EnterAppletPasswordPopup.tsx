import { RefObject, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppletPassword, AppletPasswordRef } from 'features/Applet/AppletPassword';
import { Modal } from 'components';

import { EnterAppletPasswordProps } from './EnterAppletPasswordPopup.types';
import { StyledAppletPasswordContainer } from './EnterAppletPasswordPopup.styles';

export const EnterAppletPasswordPopup = ({
  popupVisible,
  setPopupVisible,
  appletId,
  encryption,
  submitCallback = () => setPopupVisible(false),
}: EnterAppletPasswordProps) => {
  const { t } = useTranslation('app');

  const appletPasswordRef = useRef() as RefObject<AppletPasswordRef>;

  const [disabledSubmit, setDisabledSubmit] = useState(true);

  const submitForm = () => {
    if (appletPasswordRef?.current) {
      appletPasswordRef.current.submitForm();
    }
  };

  return (
    <Modal
      open={popupVisible}
      onClose={() => setPopupVisible(false)}
      onSubmit={submitForm}
      title={t('enterAppletPassword')}
      buttonText={t('submit')}
      disabledSubmit={disabledSubmit}
      width="66"
    >
      <StyledAppletPasswordContainer>
        <AppletPassword
          ref={appletPasswordRef}
          appletId={appletId}
          encryption={encryption}
          setDisabledSubmit={setDisabledSubmit}
          submitCallback={submitCallback}
        />
      </StyledAppletPasswordContainer>
    </Modal>
  );
};
