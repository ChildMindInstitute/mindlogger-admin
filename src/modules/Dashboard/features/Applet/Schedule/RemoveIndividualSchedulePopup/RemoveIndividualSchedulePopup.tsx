import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, SubmitBtnColor, Error, Spinner, SpinnerUiType } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';
import { removeIndividualEventsApi } from 'api';
import { useAppDispatch } from 'redux/store';
import { useAsync } from 'shared/hooks/useAsync';
import { applets, users } from 'modules/Dashboard/state';
import { workspaces } from 'shared/state';

import { RemoveIndividualScheduleProps } from './RemoveIndividualSchedulePopup.types';
import { Steps } from './RemoveIndividualSchedule.types';
import { getScreens } from './RemoveIndividualSchedulePopup.const';

export const RemoveIndividualSchedulePopup = ({
  appletId,
  open,
  onClose,
  isEmpty = false,
  userId,
  userName,
  'data-testid': dataTestid,
}: RemoveIndividualScheduleProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Steps>(0);
  const dispatch = useAppDispatch();
  const { getAllWorkspaceRespondents } = users.thunk;
  const { ownerId } = workspaces.useData() || {};

  const { execute, error, isLoading } = useAsync(removeIndividualEventsApi, () => {
    if (!appletId || !userId) return;
    dispatch(applets.thunk.getEvents({ appletId, respondentId: userId }));
  });

  const getNextStep = () => setStep((prevStep) => (prevStep + 1) as Steps);

  const onSubmit = async () => {
    if (!appletId || !userId) return;

    await execute({ appletId, respondentId: userId });
    getNextStep();
  };

  const handleRemovedScheduleClose = () => {
    onClose();

    if (!appletId || !ownerId) return;

    dispatch(
      getAllWorkspaceRespondents({
        params: { ownerId, appletId, shell: false },
      }),
    );
  };

  const screens = getScreens({
    name: userName,
    isEmpty,
    onSubmit,
    handleRemovedScheduleClose,
    getNextStep,
  });

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
      <StyledModalWrapper data-testid={`${dataTestid}-text`}>
        {screens[step].component}
        {error && <Error error={error} />}
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
      </StyledModalWrapper>
    </Modal>
  );
};
