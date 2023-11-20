import { useEffect, useState } from 'react';
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

import { EventFormValues } from '../EventForm.types';
import {
  DEFAULT_ACTIVITY_INCOMPLETE_VALUE,
  DEFAULT_END_TIME,
  DEFAULT_START_TIME,
} from '../EventForm.const';
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
import { getNextDayComparison } from '../EventForm.utils';

export const AvailabilityTab = ({
  hasAlwaysAvailableOption,
  'data-testid': dataTestid,
}: AvailabilityTabProps) => {
  const { t } = useTranslation('app');
  const { control, setValue, trigger } = useFormContext<EventFormValues>();
  const [
    alwaysAvailable,
    periodicity,
    startDate,
    endDate,
    startTime,
    endTime,
    reminder,
    removeWarning,
  ] = useWatch({
    control,
    name: [
      'alwaysAvailable',
      'periodicity',
      'startDate',
      'endDate',
      'startTime',
      'endTime',
      'reminder',
      'removeWarning',
    ],
  });
  const [hasNextDayLabel, setHasNextDayLabel] = useState(getNextDayComparison(startTime, endTime));
  const isOncePeriodicity = periodicity === Periodicity.Once;
  const isMonthlyPeriodicity = periodicity === Periodicity.Monthly;

  const handleSetPeriodicity = (periodicity: string | number) => {
    setValue('periodicity', periodicity as Periodicity, { shouldDirty: true });
    if (!reminder) return;
    if (periodicity === Periodicity.Monthly) {
      setValue('reminder.activityIncompleteDate', startDate as Date);
    } else {
      setValue('reminder.activityIncomplete', DEFAULT_ACTIVITY_INCOMPLETE_VALUE);
    }
    trigger(['reminder']);
  };

  const onCloseStartDateCallback = () => {
    if (typeof startDate === 'string' || !startDate || !endDate) return;
    if (endDate < startDate) {
      setValue('endDate', addDays(startDate, 1));
    }
    if (reminder) {
      isMonthlyPeriodicity && setValue('reminder.activityIncompleteDate', startDate);
      trigger(['reminder']);
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
      setValue('reminder.activityIncomplete', DEFAULT_ACTIVITY_INCOMPLETE_VALUE);
    }
  };

  const handleAvailabilityCustomChange = (event: SelectEvent) => {
    const availability = event.target.value;
    if (availability) {
      setValue('periodicity', Periodicity.Always);
      setValue('startTime', DEFAULT_START_TIME);
      setValue('endTime', DEFAULT_END_TIME);

      return;
    }

    setValue('periodicity', Periodicity.Once);
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
            minDate={typeof startDate === 'string' ? null : startDate}
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
  }, [startTime]);

  useEffect(() => {
    setHasNextDayLabel(getNextDayComparison(startTime, endTime));
  }, [startTime, endTime]);

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
      {Object.keys(removeWarning).length !== 0 && (
        <StyledBodyMedium sx={{ marginLeft: theme.spacing(1.6) }} color={variables.palette.primary}>
          {removeWarning.showRemoveAlwaysAvailable && t('scheduledAccessWarning')}
          {removeWarning.showRemoveAllScheduled && t('alwaysAvailableWarning')}
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
              />
            </StyledTimeWrapper>
            <StyledTimeWrapper sx={{ marginLeft: theme.spacing(2.4) }}>
              <TimePicker
                name="endTime"
                control={control}
                label={t('to')}
                onCustomChange={(time) => handleTimeCustomChange(time, TimeType.ToTime)}
                data-testid={`${dataTestid}-end-time`}
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
          <StyledWrapper isCheckboxDisabled={startTime === '00:00'}>
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
