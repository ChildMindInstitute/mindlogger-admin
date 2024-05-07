import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ObjectSchema } from 'yup';

import { Option, SelectController } from 'shared/components/FormComponents';
import { DefaultTabs as Tabs } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme, variables } from 'shared/styles';
import { getErrorMessage, Mixpanel } from 'shared/utils';
import { UiType } from 'shared/components/Tabs/Tabs.types';
import { applets } from 'modules/Dashboard/state';
import { applet, workspaces } from 'shared/state';
import { Periodicity, createEventApi, updateEventApi } from 'api';
import { useAsync } from 'shared/hooks/useAsync';
import { useAppDispatch } from 'redux/store';
import { calendarEvents, users } from 'modules/Dashboard/state';
import { AnalyticsCalendarPrefix } from 'shared/consts';

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

    const methods = useForm<EventFormValues>({
      resolver: yupResolver(EventFormSchema() as ObjectSchema<EventFormValues>),
      defaultValues,
      mode: 'onChange',
    });

    const {
      handleSubmit,
      control,
      watch,
      getValues,
      setValue,
      trigger,
      formState: { isDirty },
    } = methods;

    const { errors } = useFormState({
      control,
    });

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

    const eventFormConfig = {
      hasAvailabilityErrors: !!errors.startTime || !!errors.endTime,
      hasTimerErrors: !!errors.timerDuration,
      hasNotificationsErrors: !!errors.notifications || !!errors.reminder,
      hasAlwaysAvailableOption,
      'data-testid': dataTestid,
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

      Mixpanel.track(`${analyticsPrefix} Schedule successful`);
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

      const activityName = activitiesOrFlows?.find((item) => item.value === activityOrFlowId)
        ?.labelKey;

      activityName && setActivityName(activityName);
    }, [activityOrFlowId, activitiesOrFlows]);

    useEffect(() => {
      if (onFormChange) {
        onFormChange(isDirty);
      }
    }, [isDirty]);

    useEffect(() => {
      onFormIsLoading(isLoading);
    }, [isLoading]);

    useEffect(() => {
      setValue('removeWarning', removeWarning);
    }, [eventsData, activityOrFlowId, alwaysAvailable]);

    useEffect(() => {
      trigger(['startTime', 'endTime', 'notifications', 'reminder']);
    }, [startTime, endTime]);

    useEffect(() => {
      if (!hasAlwaysAvailableOption) setValue('alwaysAvailable', false);
    }, [hasAlwaysAvailableOption]);

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
