import { addMinutes, setHours, setMinutes } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { TimePicker } from 'shared/components';
import { StyledBodyLarge, theme } from 'shared/styles';
import { ConditionType } from 'shared/consts';

import {
  commonInputSx,
  commonInputWrapperSx,
  MAX_HOURS,
  MAX_MINUTES,
  MAX_TIME,
  MAX_TIME_GREATER_THAN,
  MIN_TIME,
  MIN_TIME_LESS_THAN,
  TIME_INTERVALS,
} from '../SwitchCondition.const';
import { StyledTimeRow } from '../SwitchCondition.styles';
import { TimeConditionProps } from './TimeCondition.types';

export const TimeCondition = ({
  timeValueName,
  minTimeValueName,
  maxTimeValueName,
  maxTimeValue,
  isSingleValueShown,
  isRangeValueShown,
  state,
  dataTestid,
}: TimeConditionProps) => {
  const { t } = useTranslation('app');
  const { control, setValue } = useCustomFormContext();
  const [minEndTime, setMinEndTime] = useState(MIN_TIME);

  useEffect(() => {
    if (timeValueName) {
      const singleTimeSaved = localStorage.getItem(`time-condition-${timeValueName}`);
      if (singleTimeSaved) {
        setValue(timeValueName, singleTimeSaved);
      }
    }
    if (minTimeValueName) {
      const minSaved = localStorage.getItem(`time-condition-${minTimeValueName}`);
      if (minSaved) {
        setValue(minTimeValueName, minSaved);
      }
    }
    if (maxTimeValueName) {
      const maxSaved = localStorage.getItem(`time-condition-${maxTimeValueName}`);
      if (maxSaved) {
        setValue(maxTimeValueName, maxSaved);
      }
    }
  }, [timeValueName, minTimeValueName, maxTimeValueName, setValue]);

  const persistTime = (fieldName: string, timeString: string) => {
    localStorage.setItem(`time-condition-${fieldName}`, timeString);
  };

  const onStartTimeChange = (time: string) => {
    if (!time) return;

    persistTime(minTimeValueName, time);

    const [startTimeHours, startTimeMinutes] = time.split(':');
    const resultDate = setHours(
      setMinutes(new Date(), Number(startTimeMinutes)),
      Number(startTimeHours),
    );
    setMinEndTime(resultDate);

    if (maxTimeValue && time && maxTimeValue < time) {
      if (Number(startTimeHours) === MAX_HOURS && Number(startTimeMinutes) === MAX_MINUTES) {
        setValue(maxTimeValueName, time);
        persistTime(maxTimeValueName, time);

        return;
      }
      const endTimeDate = addMinutes(resultDate, 1);
      const endTimeHours = endTimeDate.getHours();
      const endTimeMinutes = endTimeDate.getMinutes();
      const newMax = `${endTimeHours}:${endTimeMinutes}`;
      setValue(maxTimeValueName, newMax);
      persistTime(maxTimeValueName, newMax);
    }
  };

  const onSingleTimeChange = (time: string) => {
    if (!time) return;
    persistTime(timeValueName, time);
  };

  const commonTimePickerProps = {
    control,
    placeholder: t('timePlaceholder'),
    label: '',
    wrapperSx: {
      ...commonInputWrapperSx,
      minWidth: '14rem',
      width: '14rem',
    },
    inputSx: {
      ...commonInputSx,
    },
    timeIntervals: TIME_INTERVALS,
    minTime:
      state === ConditionType.LessThanTime || state === ConditionType.LessThanTimeRange
        ? MIN_TIME_LESS_THAN
        : MIN_TIME,
    maxTime:
      state === ConditionType.GreaterThan || state === ConditionType.GreaterThanTimeRange
        ? MAX_TIME_GREATER_THAN
        : MAX_TIME,
  };

  return (
    <>
      {isSingleValueShown && (
        <TimePicker
          {...commonTimePickerProps}
          name={timeValueName}
          onCustomChange={onSingleTimeChange}
          data-testid={`${dataTestid}-time`}
        />
      )}
      {isRangeValueShown && (
        <StyledTimeRow>
          <TimePicker
            {...commonTimePickerProps}
            onCustomChange={onStartTimeChange}
            name={minTimeValueName}
            data-testid={`${dataTestid}-start-time`}
          />
          <StyledBodyLarge sx={{ m: theme.spacing(0, 0.4) }}>{t('and')}</StyledBodyLarge>
          <TimePicker
            {...commonTimePickerProps}
            onCustomChange={(time) => {
              if (!time) return;
              persistTime(maxTimeValueName, time);
            }}
            minTime={minEndTime}
            maxTime={MAX_TIME}
            name={maxTimeValueName}
            data-testid={`${dataTestid}-end-time`}
          />
        </StyledTimeRow>
      )}
    </>
  );
};
