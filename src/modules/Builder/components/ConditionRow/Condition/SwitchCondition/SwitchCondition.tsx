import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { addDays } from 'date-fns';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { DatePicker } from 'shared/components';
import { CONDITION_TYPES_TO_HAVE_RANGE_VALUE } from 'shared/consts';
import { StyledBodyLarge, StyledFlexTopCenter, theme } from 'shared/styles';

import { ConditionItemType } from '../Condition.const';
import { StyledInputController } from './SwitchCondition.styles';
import { SwitchConditionProps } from './SwitchCondition.types';
import { getConditionMinMaxValues, getConditionMinMaxRangeValues } from './SwitchCondition.utils';

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

  if (!itemType) return null;

  switch (itemType) {
    case ConditionItemType.Score:
    case ConditionItemType.Slider: {
      const isNumberValueShown = !CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(state);
      const isRangeValueShown = !isNumberValueShown;

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
          {isNumberValueShown && (
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
      const isDateValueShown = !CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(state);
      const isRangeDateShown = CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(state);

      const commonDateInputProps = {
        control,
        placeholder: t('datePlaceholder'),
        hideLabel: true,
        inputWrapperSx: {
          minWidth: '18rem',
          width: '18rem',
        },
        inputSx: {
          height: '4rem',
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
          {isDateValueShown && (
            <StyledFlexTopCenter>
              <DatePicker
                name={numberValueName}
                onCloseCallback={onCloseStartDateCallback}
                data-testid={`${dataTestid}-date-value`}
                skipMinDate
                {...commonDateInputProps}
              />
            </StyledFlexTopCenter>
          )}
          {isRangeDateShown && (
            <StyledFlexTopCenter>
              <DatePicker
                name={minValueName}
                key={`min-date-value-${isRangeDateShown}`}
                onCloseCallback={onCloseStartDateCallback}
                data-testid={`${dataTestid}-start-date-value`}
                skipMinDate
                {...commonDateInputProps}
              />
              <StyledBodyLarge sx={{ m: theme.spacing(0, 0.4) }}>{t('and')}</StyledBodyLarge>
              <DatePicker
                name={maxValueName}
                key={`max-date-value-${isRangeDateShown}`}
                minDate={minValue as Date}
                data-testid={`${dataTestid}-end-date-value`}
                {...commonDateInputProps}
              />
            </StyledFlexTopCenter>
          )}
        </>
      );
    }
    default:
      return null;
  }
};
