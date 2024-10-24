import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ObjectSchema } from 'yup';

import { Option, SelectController } from 'shared/components/FormComponents';
import { DefaultTabs as Tabs } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme, variables } from 'shared/styles';
import { getErrorMessage, Mixpanel, MixpanelCalendarEvent, MixpanelProps } from 'shared/utils';
import { UiType } from 'shared/components/Tabs/Tabs.types';
import { applets } from 'modules/Dashboard/state';
import { applet, workspaces } from 'shared/state';
import { Periodicity, createEventApi, updateEventApi } from 'api';
import { useAsync } from 'shared/hooks/useAsync';
import { useAppDispatch } from 'redux/store';
import { calendarEvents, users } from 'modules/Dashboard/state';
import { AnalyticsCalendarPrefix } from 'shared/consts';

import {
  EventFormProps,
  EventFormRef,
  EventFormValues,
  EventFormWarnings,
} from './EventForm.types';
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
      onFormIsLoading,
      onFormChange,
      'data-testid': dataTestid,
      userId,
    },
    ref,
  ) => {
    const [activitiesOrFlows, setActivitiesOrFlows] = useState<null | Option[]>(null);
    const { t } = useTranslation('app');
    const dispatch = useAppDispatch();
    const appletData = applet.useAppletData();
    const { ownerId } = workspaces.useData() || {};
    const appletId = appletData?.result.id;
    const defaultValues = getDefaultValues(defaultStartDate, editedEvent);
    const eventsData = calendarEvents.useCreateEventsData() || [];

    const isIndividualCalendar = !!userId;
    const analyticsPrefix = isIndividualCalendar
      ? AnalyticsCalendarPrefix.IndividualCalendar
      : AnalyticsCalendarPrefix.GeneralCalendar;

    const form = useForm<EventFormValues>({
      resolver: yupResolver(EventFormSchema() as ObjectSchema<EventFormValues>),
      defaultValues,
      mode: 'onChange',
    });
    const { handleSubmit, control, watch, getValues, setValue, trigger, formState } = form;
    const { isDirty } = formState;
    const { errors } = useFormState({ control });
    const activityOrFlowId = watch('activityOrFlowId');
    const alwaysAvailable = watch('alwaysAvailable');
    const startTime = watch('startTime');
    const endTime = watch('endTime');

    const isAlwaysAvailableSelected =
      !!activityOrFlowId &&
      eventsData?.some(
        ({ activityOrFlowId: id, periodicityType }) =>
          getIdWithoutRegex(activityOrFlowId)?.id === id && periodicityType === Periodicity.Always,
      );
    const hasAlwaysAvailableOption = !!editedEvent || !isAlwaysAvailableSelected;

    const removeWarnings: EventFormWarnings = eventsData.reduce((acc, event) => {
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

    const eventFormConfig = {
      hasAvailabilityErrors: !!errors.startTime || !!errors.endTime,
      hasTimerErrors: !!errors.timerDuration,
      hasNotificationsErrors: !!errors.notifications || !!errors.reminder,
      hasAlwaysAvailableOption,
      'data-testid': dataTestid,
      removeWarnings,
    };

    const getEvents = () => {
      if (!appletId) return;
      dispatch(applets.thunk.getEvents({ appletId, respondentId: userId }));
      if (userId && ownerId && eventsData.length === 0) {
        dispatch(
          users.thunk.getAllWorkspaceRespondents({
            params: {
              ownerId,
              appletId,
              shell: false,
            },
          }),
        );
      }
    };

    const {
      execute: createEvent,
      error: createEventError,
      isLoading: createEventIsLoading,
    } = useAsync(createEventApi, getEvents);
    const {
      execute: updateEvent,
      error: updateEventError,
      isLoading: updateEventIsLoading,
    } = useAsync(updateEventApi, getEvents);

    const isLoading = createEventIsLoading || updateEventIsLoading;

    const handleProcessEvent = async () => {
      if (!appletId) {
        return;
      }
      const body = getEventPayload(defaultStartDate, getValues, userId);

      if (editedEvent) {
        const {
          activityId: _activityId,
          flowId: _flowId,
          respondentId: _respondentId,
          ...updateEventBody
        } = body;
        await updateEvent({
          appletId,
          eventId: editedEvent.eventId,
          body: updateEventBody,
        });
      } else {
        await createEvent({ appletId, body });
      }

      Mixpanel.track({
        action: MixpanelCalendarEvent[analyticsPrefix].ScheduleSuccessful,
        [MixpanelProps.AppletId]: appletId,
      });
    };

    const submitForm = async () => {
      if (removeWarnings.showRemoveAllScheduled) {
        setRemoveAllScheduledPopupVisible(true);

        return false;
      }

      if (removeWarnings.showRemoveAlwaysAvailable) {
        setRemoveAlwaysAvailablePopupVisible(true);

        return false;
      }

      try {
        await handleProcessEvent();
        submitCallback();

        return true;
      } catch (e) {
        // User-facing errors are handled via above useAsync hooks.
        return false;
      }
    };

    const apiError = createEventError || updateEventError;
    const getError = () => {
      if (errors.reminder?.activityIncomplete) {
        return t('activityIncompleteError');
      }
      if (eventFormConfig.hasNotificationsErrors) {
        return t('timeNotificationsError');
      }
      if (apiError) {
        return getErrorMessage(apiError);
      }

      return null;
    };

    const errorMessage = getError();

    useImperativeHandle(ref, () => ({
      formState,
      submitForm() {
        return handleSubmit(submitForm)();
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

      const activityName = activitiesOrFlows?.find((item) => item.value === activityOrFlowId)
        ?.labelKey;

      activityName && setActivityName(activityName);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activityOrFlowId, activitiesOrFlows]);

    useEffect(() => {
      if (onFormChange) {
        onFormChange(isDirty);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDirty]);

    useEffect(() => {
      onFormIsLoading(isLoading);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    useEffect(() => {
      trigger(['startTime', 'endTime', 'notifications', 'reminder']);
    }, [startTime, endTime, trigger]);

    useEffect(() => {
      if (!hasAlwaysAvailableOption && !getValues('oneTimeCompletion')) {
        setValue('alwaysAvailable', false);
        setValue('periodicity', Periodicity.Once);
      }
    }, [hasAlwaysAvailableOption, setValue, getValues]);

    return (
      <FormProvider {...form}>
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
                autoFocus={!editedEvent}
                data-testid={`${dataTestid}-activity`}
              />
            )}
          </StyledModalWrapper>
          <Tabs tabs={getEventFormTabs(eventFormConfig)} uiType={UiType.Secondary} />
          {errorMessage && (
            <StyledBodyLarge
              color={variables.palette.semantic.error}
              sx={{ m: theme.spacing(1, 2.6) }}
            >
              {errorMessage}
            </StyledBodyLarge>
          )}
        </form>
      </FormProvider>
    );
  },
);
