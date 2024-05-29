import { useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { addDays, setHours, setMinutes, addMinutes } from 'date-fns';

import { useCustomFormContext } from 'modules/Builder/hooks/useCustomFormContext';
import { DatePicker } from 'shared/components/DatePicker';
import { TimePicker } from 'shared/components/TimePicker';
import { CONDITION_TYPES_TO_HAVE_RANGE_VALUE } from 'shared/consts';
import { StyledBodyLarge, StyledFlexTopCenter, theme } from 'shared/styles';

import { ConditionItemType } from '../Condition.const';
import { StyledInputController, StyledTimeRow } from './SwitchCondition.styles';
import { SwitchConditionProps } from './SwitchCondition.types';
import { getConditionMinMaxValues, getConditionMinMaxRangeValues } from './SwitchCondition.utils';
import {
  commonInputSx,
  commonInputWrapperSx,
  maxHours,
  maxMinutes,
  maxTime,
  minTime,
} from './SwitchCondition.const';

export const SwitchCondition = ({
  selectedItem,
  itemType,
  numberValueName,
  minValueName,
  maxValueName,
  state,
  dataTestid,
}: SwitchConditionProps) => {
  const { t } = useTranslation('app');
  const { control, setValue } = useCustomFormContext();
  const [minValue, maxValue] = useWatch({ name: [minValueName, maxValueName] });
  const [minEndTime, setMinEndTime] = useState(minTime);
  const isSingleValueShown = !CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(state);
  const isRangeValueShown = !isSingleValueShown;

  if (!itemType) return null;

  switch (itemType) {
    case ConditionItemType.Score:
    case ConditionItemType.Slider:
    case ConditionItemType.NumberSelection: {
      const { minNumber, maxNumber } = getConditionMinMaxValues({
        item: selectedItem,
        state,
      });

      const { leftRange, rightRange } = getConditionMinMaxRangeValues({
        item: selectedItem,
        minValue,
        maxValue,
      });

      return (
        <>
          {isSingleValueShown && (
            <StyledInputController
              type="number"
              control={control}
              name={numberValueName}
              minNumberValue={minNumber}
              maxNumberValue={maxNumber}
              data-testid={`${dataTestid}-slider-value`}
            />
          )}
          {isRangeValueShown && (
            <>
              <StyledInputController
                key={`min-value-${isRangeValueShown}`}
                type="number"
                control={control}
                name={minValueName}
                minNumberValue={leftRange.minNumber}
                maxNumberValue={leftRange.maxNumber}
                data-testid={`${dataTestid}-min-value`}
              />
              <StyledInputController
                key={`max-value-${isRangeValueShown}`}
                type="number"
                control={control}
                name={maxValueName}
                minNumberValue={rightRange.minNumber}
                maxNumberValue={rightRange.maxNumber}
                data-testid={`${dataTestid}-max-value`}
              />
            </>
          )}
        </>
      );
    }
    case ConditionItemType.Date: {
      const commonDateInputProps = {
        control,
        placeholder: t('datePlaceholder'),
        hideLabel: true,
        inputWrapperSx: {
          ...commonInputWrapperSx,
          minWidth: '18rem',
          width: '18rem',
        },
        inputSx: {
          ...commonInputSx,
        },
      };

      const onCloseStartDateCallback = () => {
        if (!minValue || !maxValue) return;
        if (maxValue < minValue) {
          setValue(maxValueName, addDays(minValue, 1));
        }
      };

      return (
        <>
          {isSingleValueShown && (
            <StyledFlexTopCenter>
              <DatePicker
                name={numberValueName}
                data-testid={`${dataTestid}-date-value`}
                skipMinDate
                {...commonDateInputProps}
              />
            </StyledFlexTopCenter>
          )}
          {isRangeValueShown && (
            <StyledFlexTopCenter>
              <DatePicker
                name={minValueName}
                key={`min-date-value-${isRangeValueShown}`}
                onCloseCallback={onCloseStartDateCallback}
                data-testid={`${dataTestid}-start-date-value`}
                skipMinDate
                {...commonDateInputProps}
              />
              <StyledBodyLarge sx={{ m: theme.spacing(0, 0.4) }}>{t('and')}</StyledBodyLarge>
              <DatePicker
                name={maxValueName}
                key={`max-date-value-${isRangeValueShown}`}
                minDate={minValue as Date}
                data-testid={`${dataTestid}-end-date-value`}
                {...commonDateInputProps}
              />
            </StyledFlexTopCenter>
          )}
        </>
      );
    }
    case ConditionItemType.Time: {
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
        timeIntervals: 1,
      };
      const onStartTimeChange = (time: string) => {
        if (!time) return;

        const [startTimeHours, startTimeMinutes] = time.split(':');
        const resultDate = setHours(
          setMinutes(new Date(), Number(startTimeMinutes)),
          Number(startTimeHours),
        );
        setMinEndTime(resultDate);

        if (maxValue && time && maxValue < time) {
          if (Number(startTimeHours) === maxHours && Number(startTimeMinutes) === maxMinutes) {
            setValue(maxValueName, time);

            return;
          }
          const endTimeDate = addMinutes(resultDate, 1);
          const endTimeHours = endTimeDate.getHours();
          const endTimeMinutes = endTimeDate.getMinutes();
          setValue(maxValueName, `${endTimeHours}:${endTimeMinutes}`);
        }
      };

      return (
        <>
          {isSingleValueShown && (
            <TimePicker
              {...commonTimePickerProps}
              name={numberValueName}
              data-testid={`${dataTestid}-time`}
            />
          )}
          {isRangeValueShown && (
            <StyledTimeRow>
              <TimePicker
                {...commonTimePickerProps}
                onCustomChange={onStartTimeChange}
                name={minValueName}
                data-testid={`${dataTestid}-start-time`}
              />
              <StyledBodyLarge sx={{ m: theme.spacing(0, 0.4) }}>{t('and')}</StyledBodyLarge>
              <TimePicker
                {...commonTimePickerProps}
                minTime={minEndTime}
                maxTime={maxTime}
                name={maxValueName}
                data-testid={`${dataTestid}-end-time`}
              />
            </StyledTimeRow>
          )}
        </>
      );
    }
    default:
      return null;
  }
};
