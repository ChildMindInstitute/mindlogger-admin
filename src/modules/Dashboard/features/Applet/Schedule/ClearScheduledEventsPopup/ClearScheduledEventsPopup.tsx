import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Modal, SubmitBtnColor } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';
import { useAsync } from 'shared/hooks';
import { deleteScheduledEventsApi } from 'api';
import { useAppDispatch } from 'redux/store';
import { applets } from 'modules/Dashboard/state';

import { ClearScheduledEventsPopupProps, Steps } from './ClearScheduledEventsPopup.types';
import { getScreens } from './ClearScheduleEventsPopup.utils';

export const ClearScheduledEventsPopup = ({
  open,
  onClose,
  name,
  appletName,
  appletId,
  isDefault = true,
}: ClearScheduledEventsPopupProps) => {
  const { t } = useTranslation();
  const { respondentId } = useParams();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<Steps>(0);
  const { execute: deleteScheduledEvents } = useAsync(deleteScheduledEventsApi, () =>
    dispatch(applets.thunk.getEvents({ appletId, respondentId })),
  );

  const getNextStep = () =>
    setStep((prevStep) => {
      const newStep = prevStep + 1;

      return newStep as Steps;
    });
  const onSubmit = async () => {
    if (isDefault) {
      await deleteScheduledEvents({ appletId });
    }

    return getNextStep();
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
    >
      <StyledModalWrapper>{screens[step].component}</StyledModalWrapper>
    </Modal>
  );
};
