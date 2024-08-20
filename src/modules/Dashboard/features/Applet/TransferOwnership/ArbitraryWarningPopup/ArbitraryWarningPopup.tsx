import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Modal } from 'shared/components/Modal';
import { EnterAppletPassword } from 'shared/components/Password/EnterAppletPassword';
import { StyledModalWrapper, StyledTitleMedium, theme, variables } from 'shared/styles';
import { useSetupEnterAppletPassword } from 'shared/hooks';

import { getScreens } from './ArbitraryWarningPopup.utils';
import { ArbitraryWarningPopupProps, Steps } from './ArbitraryWarningPopup.types';
import { SUPPORT_LINK } from './ArbitraryWarningPopup.const';

export const ArbitraryWarningPopup = ({
  isOpen,
  onSubmit,
  onClose,
  appletId,
  appletName,
  encryption,
  'data-testid': dataTestid,
}: ArbitraryWarningPopupProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Steps>(Steps.First);
  const { appletPasswordRef, submitForm: submitPassword } = useSetupEnterAppletPassword();

  const enterPasswordScreen = (
    <EnterAppletPassword
      ref={appletPasswordRef}
      appletId={appletId}
      encryption={encryption}
      submitCallback={onSubmit}
      data-testid={`${dataTestid}-enter-password`}
    />
  );

  const screens = getScreens({
    enterPasswordScreen,
    appletName,
    onFirstSubmit: () => setStep(Steps.Second),
    onFirstCancel: () => {
      window.open(SUPPORT_LINK, '_blank', 'noopener,noreferrer');
    },
    onSecondCancel: () => setStep(Steps.First),
    onSecondSubmit: submitPassword,
  });

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t(screens[step].title)}
      onSubmit={screens[step].onSubmit}
      buttonText={t(screens[step].btnText)}
      submitBtnVariant={screens[step].submitBtnVariant}
      hasLeftBtn={screens[step].hasLeftBtn}
      leftBtnText={t(screens[step].leftBtnText)}
      leftBtnVariant={screens[step].leftBtnVariant}
      onLeftBtnSubmit={screens[step].onLeftBtnSubmit}
      submitBtnColor={screens[step].submitBtnColor}
      data-testid={dataTestid}
    >
      <>
        <StyledModalWrapper>
          <StyledTitleMedium color={variables.palette.on_surface}>
            {screens[step].content}
          </StyledTitleMedium>
          <Box sx={{ pt: theme.spacing(2.4) }}>{screens[step].component}</Box>
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
