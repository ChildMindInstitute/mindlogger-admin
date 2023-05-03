import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import isEqual from 'lodash.isequal';

import { Option, SelectController } from 'shared/components/FormComponents';
import { DefaultTabs as Tabs } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme, variables } from 'shared/styles';
import { getErrorMessage } from 'shared/utils';
import { UiType } from 'shared/components/Tabs/Tabs.types';
import { applets } from 'modules/Dashboard/state';
import { applet } from 'shared/state';
import { createEventApi, updateEventApi } from 'api';
import { useAsync } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import { calendarEvents } from 'modules/Dashboard/state';

import { EventFormProps, EventFormRef, EventFormValues, Warning } from './EventForm.types';
import { EventFormSchema } from './EventForm.schema';
import {
  getActivitiesFlows,
  getDefaultValues,
  getEventPayload,
  getIdWithoutRegex,
  getEventFormTabs,
} from './EventForm.utils';

export const EventForm = forwardRef<EventFormRef, EventFormProps>(
  (
    {
      setRemoveAllScheduledPopupVisible,
      setRemoveAlwaysAvailablePopupVisible,
      submitCallback,
      setActivityName,
      defaultStartDate,
      editedEvent,
      onFormChange,
    },
    ref,
  ) => {
    const [activitiesOrFlows, setActivitiesOrFlows] = useState<null | Option[]>(null);
    const { t } = useTranslation('app');
    const dispatch = useAppDispatch();
    const appletData = applet.useAppletData();
    const appletId = appletData?.result.id;
    const defaultValues = getDefaultValues(defaultStartDate, editedEvent);
    const eventsData = calendarEvents.useCreateEventsData() || [];

    const methods = useForm<EventFormValues>({
      resolver: yupResolver(EventFormSchema()),
      defaultValues,
      mode: 'onChange',
    });

    const { handleSubmit, control, watch, getValues, setValue, trigger } = methods;

    const { errors } = useFormState({
      control,
    });

    const errorsObj = {
      hasAvailabilityErrors: !!errors.startTime || !!errors.endTime,
      hasTimerErrors: !!errors.timerDuration,
      hasNotificationsErrors: !!errors.notifications || !!errors.reminder,
    };

    const activityOrFlowId = watch('activityOrFlowId');
    const alwaysAvailable = watch('alwaysAvailable');
    const startTime = watch('startTime');
    const endTime = watch('endTime');

    const getEvents = () => appletId && dispatch(applets.thunk.getEvents({ appletId }));
    const { execute: createEvent, error: createEventError } = useAsync(createEventApi, getEvents);
    const { execute: updateEvent, error: updateEventError } = useAsync(updateEventApi, getEvents);

    const removeWarning: Warning = eventsData.reduce((acc, event) => {
      const idWithoutFlowRegex = getIdWithoutRegex(activityOrFlowId)?.id;
      const { isAlwaysAvailable, activityOrFlowId: eventActivityOrFlowId } = event;

      if (eventActivityOrFlowId !== idWithoutFlowRegex) {
        return acc;
      }

      return {
        ...acc,
        showRemoveAlwaysAvailable: !alwaysAvailable && isAlwaysAvailable,
        showRemoveAllScheduled: alwaysAvailable && !isAlwaysAvailable,
      };
    }, {});

    // TODO: add individual event create, update
    const handleProcessEvent = async () => {
      if (!appletId) {
        return;
      }
      const { body, eventStartYear } = getEventPayload(defaultStartDate, watch);

      eventStartYear &&
        (await dispatch(
          calendarEvents.actions.setProcessedEventStartYear({
            processedEventStartYear: eventStartYear,
          }),
        ));

      if (editedEvent) {
        await updateEvent({
          appletId,
          eventId: editedEvent.eventId,
          body,
        });
      } else {
        await createEvent({ appletId, body });
      }
    };

    const submitForm = async () => {
      if (removeWarning.showRemoveAllScheduled) {
        return setRemoveAllScheduledPopupVisible(true);
      }

      if (removeWarning.showRemoveAlwaysAvailable) {
        return setRemoveAlwaysAvailablePopupVisible(true);
      }

      await handleProcessEvent();
      submitCallback();
    };

    useImperativeHandle(ref, () => ({
      submitForm() {
        handleSubmit(submitForm)();
      },
      processEvent: async () => {
        await handleProcessEvent();
      },
    }));

    useEffect(() => {
      if (!appletData) return;

      const { activities = [], activityFlows = [] } = appletData.result;
      setActivitiesOrFlows(getActivitiesFlows(activities, activityFlows));
    }, [appletData]);

    useEffect(() => {
      if (!activityOrFlowId) return;

      const activityName = activitiesOrFlows?.find(
        (item) => item.value === activityOrFlowId,
      )?.labelKey;

      activityName && setActivityName(activityName);
    }, [activityOrFlowId, activitiesOrFlows]);

    useEffect(() => {
      if (onFormChange) {
        onFormChange(!isEqual(getValues(), defaultValues));
      }
    }, [watch()]);

    useEffect(() => {
      setValue('removeWarning', removeWarning);
    }, [eventsData, activityOrFlowId, alwaysAvailable]);

    useEffect(() => {
      trigger(['startTime', 'endTime', 'notifications', 'reminder']);
    }, [startTime, endTime]);

    return (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submitForm)} noValidate autoComplete="off">
          <StyledModalWrapper sx={{ mb: theme.spacing(2) }}>
            {activitiesOrFlows && (
              <SelectController
                fullWidth
                name="activityOrFlowId"
                control={control}
                options={activitiesOrFlows}
                label={t('activity')}
                placeholder={t('selectActivity')}
                required
                InputLabelProps={{ shrink: true }}
                disabled={!!editedEvent}
              />
            )}
          </StyledModalWrapper>
          <Tabs tabs={getEventFormTabs(errorsObj)} uiType={UiType.Secondary} />
          {(createEventError || updateEventError || errorsObj.hasNotificationsErrors) && (
            <StyledBodyLarge
              color={variables.palette.semantic.error}
              sx={{ m: theme.spacing(1, 2.6) }}
            >
              {errorsObj.hasNotificationsErrors
                ? t('timeNotificationsError')
                : getErrorMessage(createEventError || updateEventError)}
            </StyledBodyLarge>
          )}
        </form>
      </FormProvider>
    );
  },
);
