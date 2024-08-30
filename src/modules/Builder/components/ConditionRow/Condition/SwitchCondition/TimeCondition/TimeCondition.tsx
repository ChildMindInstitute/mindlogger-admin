import { addMinutes, setHours, setMinutes } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

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

  const onStartTimeChange = (time: string) => {
    if (!time) return;

    const [startTimeHours, startTimeMinutes] = time.split(':');
    const resultDate = setHours(
      setMinutes(new Date(), Number(startTimeMinutes)),
      Number(startTimeHours),
    );
    setMinEndTime(resultDate);

    if (maxTimeValue && time && maxTimeValue < time) {
      if (Number(startTimeHours) === MAX_HOURS && Number(startTimeMinutes) === MAX_MINUTES) {
        setValue(maxTimeValueName, time);

        return;
      }
      const endTimeDate = addMinutes(resultDate, 1);
      const endTimeHours = endTimeDate.getHours();
      const endTimeMinutes = endTimeDate.getMinutes();
      setValue(maxTimeValueName, `${endTimeHours}:${endTimeMinutes}`);
    }
  };

  return (
    <>
      {isSingleValueShown && (
        <TimePicker
          {...commonTimePickerProps}
          name={timeValueName}
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
