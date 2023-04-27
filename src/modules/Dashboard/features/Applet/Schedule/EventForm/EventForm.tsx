import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import isEqual from 'lodash.isequal';

import { Option, SelectController } from 'shared/components/FormComponents';
import { DefaultTabs as Tabs } from 'shared/components';
import { StyledErrorText, StyledModalWrapper, theme } from 'shared/styles';
import { getErrorMessage } from 'shared/utils';
import { UiType } from 'shared/components/Tabs/Tabs.types';
import { applets } from 'modules/Dashboard/state';
import { applet } from 'shared/state';
import { createEventApi, updateEventApi } from 'api';
import { useAsync } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import { calendarEvents } from 'modules/Dashboard/state';

import { EventFormProps, EventFormRef, EventFormValues, Warning } from './EventForm.types';
import { tabs } from './EventForm.const';
import { EventFormSchema } from './EventForm.schema';
import {
  getActivitiesFlows,
  getDefaultValues,
  getEventPayload,
  getIdWithoutRegex,
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

    const { handleSubmit, control, watch, getValues, setValue } = methods;

    const activityOrFlowId = watch('activityOrFlowId');
    const alwaysAvailable = watch('alwaysAvailable');

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

    // TODO: add individual event create, update, Notifications and Reminders, add time selected error
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
      console.log('event form', watch());
    }, [watch()]);

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
          <Tabs tabs={tabs} uiType={UiType.Secondary} />
          {(createEventError || updateEventError) && (
            <StyledErrorText sx={{ m: theme.spacing(1, 2.6) }}>
              {getErrorMessage(createEventError || updateEventError)}
            </StyledErrorText>
          )}
        </form>
      </FormProvider>
    );
  },
);
