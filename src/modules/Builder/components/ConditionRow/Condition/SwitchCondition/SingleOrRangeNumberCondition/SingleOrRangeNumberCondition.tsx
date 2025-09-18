import { memo, useMemo, useCallback } from 'react';
import { useWatch } from 'react-hook-form';

import { useCustomFormContext } from 'modules/Builder/hooks';

import { StyledInputController } from '../SwitchCondition.styles';
import { SingleOrRangeNumberConditionProps } from './SingleOrRangeNumberCondition.types';
import {
  getConditionMinMaxValues,
  getConditionMinMaxRangeValues,
} from './SingleOrRangeNumberCondition.utils';

const SingleOrRangeNumberConditionComponent = ({
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
  const { control, clearErrors, trigger } = useCustomFormContext();
  const rowIndex = useWatch({ name: rowIndexName });

  const { minNumber, maxNumber } = useMemo(
    () =>
      getConditionMinMaxValues({
        item: selectedItem,
        state,
        rowIndex,
      }),
    [selectedItem, state, rowIndex],
  );

  const { leftRange, rightRange } = useMemo(
    () =>
      getConditionMinMaxRangeValues({
        item: selectedItem,
        minValue,
        maxValue,
        rowIndex,
      }),
    [selectedItem, minValue, maxValue, rowIndex],
  );

  const handleNumberChange = useCallback(
    (fieldName: string) => (event: any, onChange: () => void) => {
      // Clear errors immediately if field has error and user is entering data
      clearErrors(fieldName);
      onChange();
      // Trigger validation after change
      setTimeout(() => {
        trigger(fieldName);
      }, 100);
    },
    [clearErrors, trigger],
  );

  const handleMinValueChange = useCallback(
    (event: any, onChange: () => void) => {
      handleNumberChange(minValueName)(event, onChange);
    },
    [handleNumberChange, minValueName],
  );

  const handleMaxValueChange = useCallback(
    (event: any, onChange: () => void) => {
      handleNumberChange(maxValueName)(event, onChange);
    },
    [handleNumberChange, maxValueName],
  );

  const handleSingleValueChange = useCallback(
    (event: any, onChange: () => void) => {
      handleNumberChange(numberValueName)(event, onChange);
    },
    [handleNumberChange, numberValueName],
  );

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
          withDebounce
          onChange={handleSingleValueChange}
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
            withDebounce
            onChange={handleMinValueChange}
            data-testid={`${dataTestid}-min-value`}
          />
          <StyledInputController
            key={`max-value-${isRangeValueShown}`}
            type="number"
            control={control}
            name={maxValueName}
            minNumberValue={rightRange.minNumber}
            maxNumberValue={rightRange.maxNumber}
            withDebounce
            onChange={handleMaxValueChange}
            data-testid={`${dataTestid}-max-value`}
          />
        </>
      )}
    </>
  );
};

// Memoize component to prevent unnecessary re-renders
export const SingleOrRangeNumberCondition = memo(SingleOrRangeNumberConditionComponent);
