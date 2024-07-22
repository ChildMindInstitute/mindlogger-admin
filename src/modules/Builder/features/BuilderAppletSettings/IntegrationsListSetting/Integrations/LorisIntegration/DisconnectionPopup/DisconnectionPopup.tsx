import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Modal } from 'shared/components/Modal';
import { Svg } from 'shared/components';
import { StyledModalWrapper, theme } from 'shared/styles';

import { DisconnectionPopupProps, DisconnectionSteps } from './DisconnectionPopup.types';
import { getScreens } from './DisconnectionPopup.utils';

export const DisconnectionPopup = ({ open, onClose }: DisconnectionPopupProps) => {
  const { t } = useTranslation();

  const [step, setStep] = useState(DisconnectionSteps.CurrentConnectionInfo);

  const screens = useMemo(
    () =>
      getScreens({
        onClose,
        setStep,
      }),
    [onClose, setStep],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <>
          <Box sx={{ mr: theme.spacing(1.2) }}>
            <Svg width={94} height={94} id="loris-integration" />
          </Box>
          {t('loris.configurationPopupTitle')}
        </>
      }
      submitBtnColor="error"
      onSubmit={screens[step].rightButtonClick}
      buttonText={screens[step].rightButtonText}
      hasLeftBtn
      onLeftBtnSubmit={screens[step].leftButtonClick}
      leftBtnText={screens[step].leftButtonText}
      height={screens[step].height}
    >
      <StyledModalWrapper sx={{ mt: theme.spacing(1.2) }}>
        {screens[step].content}
      </StyledModalWrapper>
    </Modal>
  );
};
