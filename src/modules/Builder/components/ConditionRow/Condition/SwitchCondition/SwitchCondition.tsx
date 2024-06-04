import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { addDays } from 'date-fns';

import { useCustomFormContext } from 'modules/Builder/hooks/useCustomFormContext';
import { DatePicker } from 'shared/components/DatePicker';
import { CONDITION_TYPES_TO_HAVE_RANGE_VALUE } from 'shared/consts';
import { StyledBodyLarge, StyledFlexTopCenter, theme } from 'shared/styles';

import { ConditionItemType } from '../Condition.const';
import { StyledInputController } from './SwitchCondition.styles';
import { SwitchConditionProps } from './SwitchCondition.types';
import {
  getConditionMinMaxValues,
  getConditionMinMaxRangeValues,
  getTimeRangeOptions,
} from './SwitchCondition.utils';
import { commonInputSx, commonInputWrapperSx } from './SwitchCondition.const';
import { TimeCondition } from './TimeCondition';
import { StyledSelectController } from '../Condition.styles';

export const SwitchCondition = ({
  selectedItem,
  itemType,
  payloadName,
  state,
  dataTestid,
  isValueSelectDisabled,
  children,
}: SwitchConditionProps) => {
  const numberValueName = `${payloadName}.value`;
  const minValueName = `${payloadName}.minValue`;
  const maxValueName = `${payloadName}.maxValue`;
  const typeName = `${payloadName}.type`;
  const { t } = useTranslation('app');
  const { control, setValue } = useCustomFormContext();
  const [minValue, maxValue] = useWatch({ name: [minValueName, maxValueName] });
  const isSingleValueShown = !CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(state);
  const isRangeValueShown = !isSingleValueShown;

  const commonTimeConditionProps = {
    numberValueName,
    minValueName,
    maxValueName,
    maxValue,
    isSingleValueShown,
    isRangeValueShown,
    dataTestid,
  };

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
          {children}
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
          {children}
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
      return (
        <>
          {children}
          <TimeCondition {...commonTimeConditionProps} />
        </>
      );
    }
    case ConditionItemType.TimeRange:
      return (
        <>
          <StyledSelectController
            control={control}
            name={typeName}
            options={getTimeRangeOptions()}
            placeholder={
              isValueSelectDisabled ? t('conditionDisabledPlaceholder') : t('Start Time / End Time')
            }
            isLabelNeedTranslation={false}
            data-testid={`${dataTestid}-payload-type-value`}
            disabled={isValueSelectDisabled}
          />
          {children}
          <TimeCondition {...commonTimeConditionProps} />
        </>
      );
    default:
      return null;
  }
};
