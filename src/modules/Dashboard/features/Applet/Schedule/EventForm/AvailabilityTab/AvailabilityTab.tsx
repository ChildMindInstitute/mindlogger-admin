import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { addDays } from 'date-fns';

import { CheckboxController, SelectController } from 'shared/components/FormComponents';
import { DatePicker, TimePicker, ToggleButtonGroup } from 'shared/components';
import {
  StyledBodyLarge,
  StyledBodyMedium,
  StyledTitleSmall,
  theme,
  variables,
} from 'shared/styles';
import { Periodicity } from 'modules/Dashboard/api';
import { SelectEvent } from 'shared/types';
import { getNextDayComparison } from 'modules/Dashboard/state/CalendarEvents/CalendarEvents.utils';
import { DEFAULT_END_TIME, DEFAULT_START_TIME } from 'shared/consts';

import { EventFormValues } from '../EventForm.types';
import { DEFAULT_ACTIVITY_INCOMPLETE_VALUE } from '../EventForm.const';
import { repeatsButtons, TimeType } from './Availability.const';
import {
  StyledButtonsTitle,
  StyledDatePickerWrapper,
  StyledTimeRow,
  StyledTimeWrapper,
  StyledWrapper,
} from './AvailabilityTab.styles';
import { AvailabilityTabProps } from './AvailabilityTab.types';
import { getAvailabilityOptions } from './AvailabilityTab.utils';
import { useNextDayLabel } from '../EventForm.hooks';

export const AvailabilityTab = ({
  hasAlwaysAvailableOption,
  'data-testid': dataTestid,
  removeWarnings,
}: AvailabilityTabProps) => {
  const { t } = useTranslation('app');
  const { control, setValue, trigger, formState } = useFormContext<EventFormValues>();
  const [alwaysAvailable, periodicity, startDate, endDate, startTime, endTime, reminder] = useWatch(
    {
      control,
      name: [
        'alwaysAvailable',
        'periodicity',
        'startDate',
        'endDate',
        'startTime',
        'endTime',
        'reminder',
      ],
    },
  );
  const hasNextDayLabel = useNextDayLabel({ startTime, endTime });
  const isOncePeriodicity = periodicity === Periodicity.Once;

  const handleSetPeriodicity = (periodicity: string | number) => {
    setValue('periodicity', periodicity as Periodicity, { shouldDirty: true });
    if (!reminder) return;
    setValue('reminder.activityIncomplete', DEFAULT_ACTIVITY_INCOMPLETE_VALUE, {
      shouldDirty: true,
    });
    trigger(['reminder']);
  };

  const onCloseStartDateCallback = () => {
    if (typeof startDate === 'string' || !startDate || !endDate) return;
    if (endDate < startDate) {
      setValue('endDate', addDays(startDate, 1));
    }
  };

  const handleTimeCustomChange = (time: string, type: TimeType) => {
    if (
      !reminder ||
      !isOncePeriodicity ||
      reminder.activityIncomplete === DEFAULT_ACTIVITY_INCOMPLETE_VALUE
    )
      return;
    const isFromTime = type === TimeType.FromTime;
    const fromTime = isFromTime ? time : startTime;
    const toTime = isFromTime ? endTime : time;
    const isCrossDayEvent = getNextDayComparison(fromTime, toTime);
    if (!isCrossDayEvent) {
      setValue('reminder.activityIncomplete', DEFAULT_ACTIVITY_INCOMPLETE_VALUE, {
        shouldDirty: true,
      });
    }
  };

  const handleAvailabilityCustomChange = (event: SelectEvent) => {
    const availability = event.target.value;
    const { defaultValues } = formState;

    if (availability) {
      setValue('periodicity', Periodicity.Always);
      setValue('startTime', DEFAULT_START_TIME);
      setValue('endTime', DEFAULT_END_TIME);
      reminder &&
        setValue('reminder.activityIncomplete', DEFAULT_ACTIVITY_INCOMPLETE_VALUE, {
          shouldDirty: true,
        });

      return;
    }

    setValue(
      'periodicity',
      (defaultValues?.periodicity === Periodicity.Always
        ? Periodicity.Once
        : defaultValues?.periodicity) ?? Periodicity.Once,
    );
    setValue('startTime', defaultValues?.startTime ?? DEFAULT_START_TIME);
    setValue('endTime', defaultValues?.endTime ?? DEFAULT_END_TIME);
    setValue('accessBeforeSchedule', defaultValues?.accessBeforeSchedule ?? false);
    setValue('oneTimeCompletion', defaultValues?.oneTimeCompletion ?? false);
  };

  const datePicker = (
    <StyledDatePickerWrapper>
      <DatePicker
        name={isOncePeriodicity ? 'date' : 'startDate'}
        key={isOncePeriodicity ? 'date' : 'startDate'}
        control={control}
        label={isOncePeriodicity ? t('date') : t('startDate')}
        onCloseCallback={onCloseStartDateCallback}
        data-testid={`${dataTestid}-start-date`}
      />
      {!isOncePeriodicity && (
        <>
          <StyledBodyLarge sx={{ m: theme.spacing(0, 2.4) }}>
            {t('to').toLowerCase()}
          </StyledBodyLarge>
          <DatePicker
            name="endDate"
            key="endDate"
            minDate={startDate as Date}
            control={control}
            label={t('endDate')}
            onCloseCallback={() => reminder && trigger(['reminder'])}
            data-testid={`${dataTestid}-end-date`}
          />
        </>
      )}
    </StyledDatePickerWrapper>
  );

  useEffect(() => {
    if (startTime === DEFAULT_START_TIME) {
      setValue('accessBeforeSchedule', false);
    }
  }, [startTime, setValue]);

  return (
    <>
      <SelectController
        name="alwaysAvailable"
        fullWidth
        options={getAvailabilityOptions(hasAlwaysAvailableOption)}
        control={control}
        customChange={handleAvailabilityCustomChange}
        data-testid={`${dataTestid}-always-available`}
      />
      {Object.keys(removeWarnings ?? {}).length !== 0 && (
        <StyledBodyMedium sx={{ marginLeft: theme.spacing(1.6) }} color={variables.palette.primary}>
          {removeWarnings?.showRemoveAlwaysAvailable && t('scheduledAccessWarning')}
          {removeWarnings?.showRemoveAllScheduled && t('alwaysAvailableWarning')}
        </StyledBodyMedium>
      )}
      {alwaysAvailable ? (
        <StyledWrapper>
          <CheckboxController
            name="oneTimeCompletion"
            control={control}
            label={<StyledBodyMedium>{t('oneTimeCompletion')}</StyledBodyMedium>}
            data-testid={`${dataTestid}-one-time-completion`}
          />
        </StyledWrapper>
      ) : (
        <>
          <StyledWrapper>
            <StyledButtonsTitle>{t('usersCanAccessActivity')}</StyledButtonsTitle>
            <ToggleButtonGroup
              toggleButtons={repeatsButtons}
              activeButton={periodicity}
              setActiveButton={handleSetPeriodicity}
              data-testid={`${dataTestid}-periodicity`}
            />
          </StyledWrapper>
          <StyledTimeRow>
            <StyledTimeWrapper>
              <TimePicker
                name="startTime"
                control={control}
                label={t('from')}
                onCustomChange={(time) => handleTimeCustomChange(time, TimeType.FromTime)}
                data-testid={`${dataTestid}-start-time`}
                defaultTime={DEFAULT_START_TIME}
              />
            </StyledTimeWrapper>
            <StyledTimeWrapper
              data-testid={`${dataTestid}-end-time-wrapper`}
              sx={{ marginLeft: theme.spacing(2.4) }}
            >
              <TimePicker
                name="endTime"
                control={control}
                label={t('to')}
                onCustomChange={(time) => handleTimeCustomChange(time, TimeType.ToTime)}
                data-testid={`${dataTestid}-end-time`}
                defaultTime={DEFAULT_END_TIME}
              />
              {hasNextDayLabel && (
                <StyledTitleSmall
                  sx={{
                    mx: theme.spacing(1.6),
                  }}
                >
                  {t('nextDay')}
                </StyledTitleSmall>
              )}
            </StyledTimeWrapper>
          </StyledTimeRow>
          <StyledWrapper isCheckboxDisabled={startTime === DEFAULT_START_TIME}>
            <CheckboxController
              name="accessBeforeSchedule"
              control={control}
              label={<StyledBodyMedium>{t('allowAccessBeforeTime')}</StyledBodyMedium>}
              data-testid={`${dataTestid}-access-before-schedule`}
            />
          </StyledWrapper>
          {datePicker}
        </>
      )}
    </>
  );
};
