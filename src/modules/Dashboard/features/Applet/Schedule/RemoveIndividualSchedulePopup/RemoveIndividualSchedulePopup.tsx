import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { Modal, SubmitBtnColor, Error } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';
import { removeIndividualEventsApi } from 'api';
import { useAppDispatch } from 'redux/store';
import { useAsync } from 'shared/hooks';
import { applets } from 'modules/Dashboard/state';
import { page } from 'resources';

import { RemoveIndividualScheduleProps } from './RemoveIndividualSchedulePopup.types';
import { Steps } from './RemoveIndividualSchedule.types';
import { getScreens } from './RemoveIndividualSchedulePopup.const';
import { ScheduleOptions } from '../Legend/Legend.const';

export const RemoveIndividualSchedulePopup = ({
  open,
  onClose,
  name,
  isEmpty,
  setSchedule,
  setSelectedRespondent,
}: RemoveIndividualScheduleProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Steps>(0);
  const { appletId, respondentId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { execute, error } = useAsync(
    removeIndividualEventsApi,
    () => appletId && dispatch(applets.thunk.getEvents({ appletId, respondentId })),
  );

  const getNextStep = () =>
    setStep((prevStep) => {
      const newStep = prevStep + 1;

      return newStep as Steps;
    });

  const onSubmit = async () => {
    if (!appletId || !respondentId) return;

    await execute({ appletId, respondentId });
    getNextStep();
  };

  const handleRemovedScheduleClose = () => {
    setSchedule(ScheduleOptions.DefaultSchedule);
    setSelectedRespondent(null);
    navigate(generatePath(page.appletSchedule, { appletId }));
    onClose();
  };

  const screens = getScreens({ name, isEmpty, onSubmit, handleRemovedScheduleClose, getNextStep });

  return (
    <Modal
      open={open}
      onClose={step === 1 ? handleRemovedScheduleClose : onClose}
      title={t(screens[step].title)}
      onSubmit={screens[step].onSubmit}
      buttonText={t(screens[step].buttonText)}
      hasSecondBtn={screens[step].hasSecondBtn}
      submitBtnColor={screens[step].submitBtnColor as SubmitBtnColor | undefined}
      onSecondBtnSubmit={onClose}
      secondBtnText={t('cancel')}
    >
      <StyledModalWrapper>
        {screens[step].component}
        {error && <Error error={error} />}
      </StyledModalWrapper>
    </Modal>
  );
};
