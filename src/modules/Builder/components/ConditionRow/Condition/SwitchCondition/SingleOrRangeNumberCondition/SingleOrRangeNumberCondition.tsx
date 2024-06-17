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
  minValue,
  maxValue,
  isSingleValueShown,
  isRangeValueShown,
  dataTestid,
}: SingleOrRangeNumberConditionProps) => {
  const { control } = useCustomFormContext();

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
};
