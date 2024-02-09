import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { removeIndividualEventsApi } from 'api';
import { applets, users } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { Modal, SubmitBtnColor, Error, Spinner, SpinnerUiType } from 'shared/components';
import { useAsync } from 'shared/hooks/useAsync';
import { workspaces } from 'shared/state';
import { StyledModalWrapper } from 'shared/styles';

import { ScheduleOptions } from '../Legend/Legend.const';
import { Steps } from './RemoveIndividualSchedule.types';
import { getScreens } from './RemoveIndividualSchedulePopup.const';
import { RemoveIndividualScheduleProps } from './RemoveIndividualSchedulePopup.types';

export const RemoveIndividualSchedulePopup = ({
  open,
  onClose,
  name,
  isEmpty,
  setSchedule,
  setSelectedRespondent,
  'data-testid': dataTestid,
}: RemoveIndividualScheduleProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Steps>(0);
  const { appletId, respondentId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { getAllWorkspaceRespondents } = users.thunk;
  const { ownerId } = workspaces.useData() || {};
  const { execute, error, isLoading } = useAsync(removeIndividualEventsApi, () => {
    if (!appletId) return;
    dispatch(applets.thunk.getEvents({ appletId, respondentId }));
  });

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
    if (!appletId || !ownerId) return;
    dispatch(
      getAllWorkspaceRespondents({
        params: { ownerId, appletId },
      }),
    );
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
      disabledSubmit={isLoading}
      data-testid={dataTestid}
    >
      <>
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <StyledModalWrapper data-testid={`${dataTestid}-text`}>
          {screens[step].component}
          {error && <Error error={error} />}
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
