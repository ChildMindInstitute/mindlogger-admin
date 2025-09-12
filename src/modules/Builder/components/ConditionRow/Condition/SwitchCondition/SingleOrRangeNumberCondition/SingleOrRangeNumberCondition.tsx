import { memo, useMemo } from 'react';
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
  const { control } = useCustomFormContext();
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
            data-testid={`${dataTestid}-max-value`}
          />
        </>
      )}
    </>
  );
};

// Memoize component to prevent unnecessary re-renders
export const SingleOrRangeNumberCondition = memo(SingleOrRangeNumberConditionComponent);
