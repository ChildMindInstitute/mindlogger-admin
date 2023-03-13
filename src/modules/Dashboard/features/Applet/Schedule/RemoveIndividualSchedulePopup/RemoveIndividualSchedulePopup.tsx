import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, SubmitBtnColor } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles/styledComponents';

import { RemoveIndividualSchedulePopupProps } from './RemoveIndividualSchedulePopup.types';
import { Steps } from './RemoveIndividualSchedule.types';
import { getScreens } from './RemoveIndividualSchedulePopup.const';

export const RemoveIndividualSchedulePopup = ({
  open,
  onClose,
  name,
  isEmpty,
}: RemoveIndividualSchedulePopupProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Steps>(0);

  const onSubmit = () => {
    setStep((prevStep) => ++prevStep as Steps);
  };

  const screens = getScreens({ name, isEmpty, onSubmit, onClose });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t(screens[step].title)}
      onSubmit={screens[step].onSubmit}
      buttonText={t(screens[step].buttonText)}
      hasSecondBtn={screens[step].hasSecondBtn}
      submitBtnColor={screens[step].submitBtnColor as SubmitBtnColor | undefined}
      onSecondBtnSubmit={onClose}
      secondBtnText={t('cancel')}
    >
      <StyledModalWrapper>{screens[step].component}</StyledModalWrapper>
    </Modal>
  );
};
