import { useWatch, useFormContext } from 'react-hook-form';

import { useCustomFormContext } from 'modules/Builder/hooks';

import { StyledInputController } from '../SwitchCondition.styles';
import { SingleOrRangeNumberConditionProps } from './SingleOrRangeNumberCondition.types';
import {
  getConditionMinMaxValues,
  getConditionMinMaxRangeValues,
} from './SingleOrRangeNumberCondition.utils';

export const SingleOrRangeNumberCondition = ({
  children,
  state,
  selectedItem,
  numberValueName,
  minValueName,
  maxValueName,
  rowIndexName,
  minValue,
  maxValue,
  isSingleValueShown,
  isRangeValueShown,
  dataTestid,
}: SingleOrRangeNumberConditionProps) => {
  const { control } = useCustomFormContext();
  const { clearErrors, trigger } = useFormContext();
  const rowIndex = useWatch({ name: rowIndexName });

  const { minNumber, maxNumber } = getConditionMinMaxValues({
    item: selectedItem,
    state,
    rowIndex,
  });
  const { leftRange, rightRange } = getConditionMinMaxRangeValues({
    item: selectedItem,
    minValue,
    maxValue,
    rowIndex,
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
          onInput={() => {
            // Clear errors immediately when user starts typing
            clearErrors(numberValueName);
          }}
          onBlur={() => {
            // Trigger validation on blur for performance
            setTimeout(() => trigger(numberValueName), 100);
          }}
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
            onInput={() => {
              // Clear errors immediately when user starts typing
              clearErrors(minValueName);
            }}
            onBlur={() => {
              // Trigger validation on blur for performance
              setTimeout(() => trigger(minValueName), 100);
            }}
            data-testid={`${dataTestid}-min-value`}
          />
          <StyledInputController
            key={`max-value-${isRangeValueShown}`}
            type="number"
            control={control}
            name={maxValueName}
            minNumberValue={rightRange.minNumber}
            maxNumberValue={rightRange.maxNumber}
            onInput={() => {
              // Clear errors immediately when user starts typing
              clearErrors(maxValueName);
            }}
            onBlur={() => {
              // Trigger validation on blur for performance
              setTimeout(() => trigger(maxValueName), 100);
            }}
            data-testid={`${dataTestid}-max-value`}
          />
        </>
      )}
    </>
  );
};
