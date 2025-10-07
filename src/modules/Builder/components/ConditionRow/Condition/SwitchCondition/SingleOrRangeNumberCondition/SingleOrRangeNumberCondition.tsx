import { useState, useEffect } from 'react';
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
  const { control, setValue, getValues } = useCustomFormContext();
  const { clearErrors, trigger } = useFormContext();
  const rowIndex = useWatch({ name: rowIndexName });

  // Local state for instant typing feedback
  const [localValues, setLocalValues] = useState(() => ({
    number: String(getValues(numberValueName) ?? ''),
    min: String(getValues(minValueName) ?? ''),
    max: String(getValues(maxValueName) ?? ''),
  }));

  // Sync local state when form values change externally
  const formValues = {
    number: useWatch({ name: numberValueName, control }),
    min: useWatch({ name: minValueName, control }),
    max: useWatch({ name: maxValueName, control }),
  };

  useEffect(() => {
    setLocalValues({
      number: String(formValues.number ?? ''),
      min: String(formValues.min ?? ''),
      max: String(formValues.max ?? ''),
    });
  }, [formValues.number, formValues.min, formValues.max]);

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
          value={localValues.number}
          onChange={(e) => {
            const value = e.target.value;
            setLocalValues((prev) => ({ ...prev, number: value }));
            if (value === '') {
              // Trigger validation immediately when content is cleared
              setValue(numberValueName, '');
              setTimeout(() => trigger(numberValueName), 0);
            } else {
              clearErrors(numberValueName);
            }
          }}
          onBlur={(e) => {
            const value = e.target.value;
            setValue(numberValueName, value === '' ? '' : Number(value));
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
            value={localValues.min}
            onChange={(e) => {
              const value = e.target.value;
              setLocalValues((prev) => ({ ...prev, min: value }));
              if (value === '') {
                // Trigger validation immediately when content is cleared
                setValue(minValueName, '');
                setTimeout(() => trigger(minValueName), 0);
              } else {
                clearErrors(minValueName);
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              setValue(minValueName, value === '' ? '' : Number(value));
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
            value={localValues.max}
            onChange={(e) => {
              const value = e.target.value;
              setLocalValues((prev) => ({ ...prev, max: value }));
              if (value === '') {
                // Trigger validation immediately when content is cleared
                setValue(maxValueName, '');
                setTimeout(() => trigger(maxValueName), 0);
              } else {
                clearErrors(maxValueName);
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              setValue(maxValueName, value === '' ? '' : Number(value));
              setTimeout(() => trigger(maxValueName), 100);
            }}
            data-testid={`${dataTestid}-max-value`}
          />
        </>
      )}
    </>
  );
};
