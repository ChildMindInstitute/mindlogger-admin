import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Modal, Spinner, SpinnerUiType, SubmitBtnColor } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme, variables } from 'shared/styles';
import { useAsync } from 'shared/hooks/useAsync';
import { deleteScheduledEventsApi, deleteIndividualEventsApi } from 'api';
import { useAppDispatch } from 'redux/store';
import { applets } from 'modules/Dashboard/state';
import { getErrorMessage } from 'shared/utils';

import { ClearScheduledEventsPopupProps, Steps } from './ClearScheduledEventsPopup.types';
import { getScreens } from './ClearScheduleEventsPopup.utils';

export const ClearScheduledEventsPopup = ({
  open,
  onClose,
  name,
  appletName,
  appletId,
  isDefault = true,
  'data-testid': dataTestid,
}: ClearScheduledEventsPopupProps) => {
  const { t } = useTranslation();
  const { respondentId } = useParams();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<Steps>(0);
  const {
    execute: deleteScheduledEvents,
    error: deleteScheduledError,
    isLoading: deleteScheduledLoading,
  } = useAsync(deleteScheduledEventsApi, () => dispatch(applets.thunk.getEvents({ appletId })));
  const {
    execute: deleteIndividualScheduledEvents,
    error: deleteIndividualScheduledError,
    isLoading: deleteIndividualScheduledLoading,
  } = useAsync(deleteIndividualEventsApi, () =>
    dispatch(applets.thunk.getEvents({ appletId, respondentId })),
  );

  const isLoading = deleteScheduledLoading || deleteIndividualScheduledLoading;

  const getNextStep = () =>
    setStep((prevStep) => {
      const newStep = prevStep + 1;

      return newStep as Steps;
    });

  const handleScheduledEventsDelete = async () => {
    if (isDefault) {
      return await deleteScheduledEvents({ appletId });
    }

    return respondentId && (await deleteIndividualScheduledEvents({ appletId, respondentId }));
  };

  const onSubmit = async () => {
    await handleScheduledEventsDelete();

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
      disabledSubmit={isLoading}
      data-testid={dataTestid}
    >
      <>
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <StyledModalWrapper data-testid={`${dataTestid}-text`}>
          {screens[step].component}
          {(deleteScheduledError || deleteIndividualScheduledError) && (
            <StyledBodyLarge
              color={variables.palette.semantic.error}
              sx={{ m: theme.spacing(1, 0) }}
            >
              {getErrorMessage(deleteScheduledError || deleteIndividualScheduledError)}
            </StyledBodyLarge>
          )}
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
