import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';

import { Option, SelectController } from 'shared/components/FormComponents';
import { DefaultTabs as Tabs } from 'shared/components';
import { theme, StyledModalWrapper, StyledErrorText } from 'shared/styles';
import { getErrorMessage } from 'shared/utils';
import { UiType } from 'shared/components/Tabs/Tabs.types';
import { applets } from 'modules/Dashboard/state';
import { createEventApi, CreateEventType, Periodicity, TimerType } from 'api';
import { useAsync } from 'shared/hooks';
import { DateFormats } from 'shared/consts';

import { ActivityFormProps, ActivityFormRef, FormValues } from './ActivityForm.types';
import { tabs, getDefaultValues } from './ActivityForm.const';
import { ActivityFormSchema } from './ActivityForm.schema';
import {
  addSecondsToHourMinutes,
  convertDateToYearMonthDay,
  getActivitiesFlows,
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
    const [selectValues, setSelectValues] = useState<null | Option[]>(null);
    const { t } = useTranslation('app');
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

    // TODO: add get events callback
    const { execute, error } = useAsync(createEventApi);

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

      if (timerType === TimerType.Timer) {
        body.timer = addSecondsToHourMinutes(timerDuration);
      }

      if (timerType === TimerType.Idle) {
        body.timer = addSecondsToHourMinutes(idleTime);
      }

      if (alwaysAvailable) {
        body.oneTimeCompletion = oneTimeCompletion;
        body.periodicity = {
          type: 'ALWAYS',
          selectedDate: format(defaultStartDate as Date, DateFormats.YearMonthDay),
        };
      } else {
        body.startTime = addSecondsToHourMinutes(startTime);
        body.endTime = addSecondsToHourMinutes(endTime);
        body.accessBeforeSchedule = accessBeforeSchedule;

        body.periodicity = {
          type: periodicity,
          ...(periodicity === Periodicity.Once
            ? {
                selectedDate: convertDateToYearMonthDay(date as Date),
              }
            : {
                startDate: convertDateToYearMonthDay(startEndingDate[0] as Date),
                ...(startEndingDate[1] && {
                  endDate: convertDateToYearMonthDay(startEndingDate[1] as Date),
                }),
              }),
          ...(defaultStartDate &&
            (periodicity === Periodicity.Weekly || periodicity === Periodicity.Monthly) && {
              selectedDate: format(defaultStartDate as Date, DateFormats.YearMonthDay),
            }),
        };
      }

      // TODO: add individual schedule events create with the respondentId when the API is ready and is connected
      // TODO: add Notifications and Reminders when the API is ready, add time selected error due to the story
      await execute({ appletId, body });
    };

    const submitForm = async () => {
      if (dirtyFields.alwaysAvailable) {
        if (alwaysAvailable) {
          setRemoveAllScheduledPopupVisible(true);
        } else {
          setRemoveAlwaysAvailablePopupVisible(true);
        }
      } else {
        await handleCreateEvent();
        submitCallback();
      }
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
      setSelectValues(getActivitiesFlows(activities, activityFlows));
    }, [appletData]);

    useEffect(() => {
      if (!activityOrFlowId) return;

      const activityName = selectValues?.find((item) => item.value === activityOrFlowId)?.labelKey;
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
              options={selectValues || []}
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
