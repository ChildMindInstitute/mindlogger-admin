import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, SubmitBtnColor } from 'components';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';

import { ClearScheduledEventsPopupProps, Steps } from './ClearScheduledEventsPopup.types';
import { getScreens } from './ClearScheduleEventsPopup.const';

export const ClearScheduledEventsPopup = ({
  open,
  onClose,
  name,
  appletName,
  isDefault = true,
}: ClearScheduledEventsPopupProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Steps>(0);

  const onSubmit = () => {
    setStep((prevStep) => ++prevStep as Steps);
  };

  const screens = getScreens({ appletName, name, isDefault, onSubmit, onClose });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t(screens[step].title)}
      onSubmit={screens[step].onSubmit}
      buttonText={t(screens[step].buttonText)}
      submitBtnColor={screens[step].submitBtnColor as SubmitBtnColor | undefined}
      hasSecondBtn={screens[step].hasSecondBtn}
      onSecondBtnSubmit={onClose}
      secondBtnText={t('cancel')}
      width="66"
    >
      <StyledModalWrapper>{screens[step].component}</StyledModalWrapper>
    </Modal>
  );
};
