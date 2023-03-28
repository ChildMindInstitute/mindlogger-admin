import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Option, SelectController } from 'shared/components/FormComponents';
import { DefaultTabs as Tabs } from 'shared/components';
import { StyledErrorText, StyledModalWrapper, theme } from 'shared/styles';
import { getErrorMessage } from 'shared/utils';
import { UiType } from 'shared/components/Tabs/Tabs.types';
import { applets } from 'modules/Dashboard/state';
import { createEventApi, CreateEventType, Periodicity } from 'api';
import { useAsync } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';

import { ActivityFormProps, ActivityFormRef, FormValues } from './ActivityForm.types';
import { getDefaultValues, tabs } from './ActivityForm.const';
import { ActivityFormSchema } from './ActivityForm.schema';
import {
  addSecondsToHourMinutes,
  convertDateToYearMonthDay,
  getActivitiesFlows,
  getTimer,
} from './ActivityForm.utils';

export const ActivityForm = forwardRef<ActivityFormRef, ActivityFormProps>(
  (
    {
      setRemoveAllScheduledPopupVisible,
      setRemoveAlwaysAvailablePopupVisible,
      submitCallback,
      setActivityName,
      defaultStartDate,
    },
    ref,
  ) => {
    const [activitiesOrFlows, setActivitiesOrFlows] = useState<null | Option[]>(null);
    const { t } = useTranslation('app');
    const dispatch = useAppDispatch();
    const appletData = applets.useAppletData();
    const appletId = appletData?.result.id;

    //TODO: add filling up the form with the data of the edited event when the get events API is connected
    const methods = useForm<FormValues>({
      resolver: yupResolver(ActivityFormSchema()),
      defaultValues: getDefaultValues(defaultStartDate),
      mode: 'onChange',
    });

    const {
      handleSubmit,
      control,
      formState: { dirtyFields },
      watch,
    } = methods;

    const activityOrFlowId = watch('activityOrFlowId');
    const alwaysAvailable = watch('alwaysAvailable');
    const oneTimeCompletion = watch('oneTimeCompletion');
    const timerType = watch('timerType');
    const timerDuration = watch('timerDuration');
    const idleTime = watch('idleTime');
    const periodicity = watch('periodicity');
    const startTime = watch('startTime');
    const endTime = watch('endTime');
    const accessBeforeSchedule = watch('accessBeforeSchedule');
    const date = watch('date');
    const startEndingDate = watch('startEndingDate');

    const { execute, error } = useAsync(
      createEventApi,
      () => appletId && dispatch(applets.thunk.getEvents({ appletId })),
    );

    const handleCreateEvent = async () => {
      if (!appletId) {
        return;
      }

      const regexWithFlow = /^flow-/;
      const isFlowId = regexWithFlow.test(activityOrFlowId);

      const body: CreateEventType['body'] = {
        timerType,
        ...(isFlowId
          ? { flowId: activityOrFlowId.replace(regexWithFlow, '') }
          : { activityId: activityOrFlowId }),
      };

      getTimer(timerType, body, timerDuration, idleTime);

      if (alwaysAvailable) {
        body.oneTimeCompletion = oneTimeCompletion;
        body.periodicity = {
          type: Periodicity.Always,
          ...(defaultStartDate && {
            selectedDate: convertDateToYearMonthDay(defaultStartDate),
          }),
        };
      } else {
        body.startTime = addSecondsToHourMinutes(startTime);
        body.endTime = addSecondsToHourMinutes(endTime);
        body.accessBeforeSchedule = accessBeforeSchedule;

        body.periodicity = {
          type: periodicity,
          ...(periodicity === Periodicity.Once
            ? {
                selectedDate: convertDateToYearMonthDay(date),
              }
            : {
                ...(startEndingDate[0] && {
                  startDate: convertDateToYearMonthDay(startEndingDate[0]),
                }),
                ...(startEndingDate[1] && {
                  endDate: convertDateToYearMonthDay(startEndingDate[1]),
                }),
              }),

          ...(defaultStartDate &&
            (periodicity === Periodicity.Weekly || periodicity === Periodicity.Monthly) && {
              selectedDate: convertDateToYearMonthDay(defaultStartDate),
            }),
        };
      }

      // TODO: add individual schedule events create with the respondentId when the API is ready and is connected
      // TODO: add Notifications and Reminders when the API is ready, add time selected error due to the story
      await execute({ appletId, body });
    };

    const submitForm = async () => {
      if (dirtyFields.alwaysAvailable) {
        return alwaysAvailable
          ? setRemoveAllScheduledPopupVisible(true)
          : setRemoveAlwaysAvailablePopupVisible(true);
      }

      await handleCreateEvent();
      !error && submitCallback();
    };

    useImperativeHandle(ref, () => ({
      submitForm() {
        handleSubmit(submitForm)();
      },
      createEvent() {
        handleCreateEvent();
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
      setActivityName(activityName || '');
    }, [activityOrFlowId]);

    return (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submitForm)} noValidate autoComplete="off">
          <StyledModalWrapper sx={{ mb: theme.spacing(2) }}>
            <SelectController
              fullWidth
              name="activityOrFlowId"
              control={control}
              options={activitiesOrFlows || []}
              label={t('activity')}
              placeholder={t('selectActivity')}
              required
              InputLabelProps={{ shrink: true }}
            />
          </StyledModalWrapper>
          <Tabs tabs={tabs} uiType={UiType.Secondary} />
          {error && (
            <StyledErrorText sx={{ m: theme.spacing(1, 2.6) }}>
              {getErrorMessage(error)}
            </StyledErrorText>
          )}
        </form>
      </FormProvider>
    );
  },
);
