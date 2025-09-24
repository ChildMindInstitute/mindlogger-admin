import { useEffect, useRef, FocusEventHandler, useCallback, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';

import { Svg } from 'shared/components/Svg';
import { Tooltip } from 'shared/components/Tooltip';
import { StyledClearedButton } from 'shared/styles/styledComponents/Buttons';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents/Flex';
import { SelectEvent } from 'shared/types/event';
import { CHANGE_DEBOUNCE_VALUE } from 'shared/consts';

import { ArrowPressType } from '../InputController.types';
import { InputProps } from './Input.types';
import {
  StyledCounter,
  StyledHint,
  StyledTextField,
  StyledTextFieldContainer,
  StyledUpDown,
} from './Input.styles';
import { getTextAdornment } from './Input.utils';

export const Input = <T extends FieldValues>({
  onChange,
  onBlur,
  value,
  minNumberValue,
  maxNumberValue,
  onArrowPress,
  onCustomChange,
  maxLength,
  restrictExceededValueLength,
  tooltip,
  error,
  helperText,
  InputProps,
  Counter = StyledCounter,
  counterProps,
  textAdornment,
  withDebounce = false,
  hintText,
  disabled,
  'data-testid': dataTestid,
  ...textFieldProps
}: InputProps<T>) => {
  const { t } = useTranslation('app');
  const inputRef = useRef<HTMLInputElement | null>();
  const isNumberType = textFieldProps.type === 'number';
  const isControlledNumberValue = minNumberValue !== undefined || maxNumberValue !== undefined;
  const getTextFieldValue = () => {
    if (!isNumberType || !isControlledNumberValue) return value ?? '';

    if (minNumberValue !== undefined && value < minNumberValue) {
      return String(minNumberValue);
    }

    if (maxNumberValue !== undefined && value > maxNumberValue) {
      return String(maxNumberValue);
    }

    return String(value);
  };

  const numberValue = isNaN(+value) ? 0 : +value;

  // Debounced handler specifically for button clicks - better UX
  const handleDebouncedButtonChange = useMemo(
    () =>
      debounce((value: number) => {
        onChange?.(value);
      }, 100), // Short debounce for responsive button clicks
    [onChange],
  );

  // Optimized handlers for plus/minus buttons - always return numbers, no leading zeros
  const handleAddNumber = useCallback(() => {
    const newNumber = numberValue + 1;
    if (onArrowPress) return onArrowPress(newNumber, ArrowPressType.Add);
    if (maxNumberValue === undefined || newNumber <= maxNumberValue) {
      if (withDebounce) {
        handleDebouncedButtonChange(newNumber);
      } else {
        onChange?.(newNumber);
      }
    }
  }, [
    numberValue,
    onArrowPress,
    maxNumberValue,
    withDebounce,
    handleDebouncedButtonChange,
    onChange,
  ]);

  const handleSubtractNumber = useCallback(() => {
    const newNumber = numberValue - 1;
    if (onArrowPress) return onArrowPress(newNumber, ArrowPressType.Subtract);
    if (minNumberValue === undefined || newNumber >= minNumberValue) {
      if (withDebounce) {
        handleDebouncedButtonChange(newNumber);
      } else {
        onChange?.(newNumber);
      }
    }
  }, [
    numberValue,
    onArrowPress,
    minNumberValue,
    withDebounce,
    handleDebouncedButtonChange,
    onChange,
  ]);
  const handleChange = useCallback(
    (event: SelectEvent) => {
      const newValue = event.target.value;

      const handleChangeLogic = () => {
        if (restrictExceededValueLength && newValue && maxLength && newValue.length > maxLength)
          return;

        // For non-number inputs, pass through unchanged
        if (!isNumberType) {
          onChange?.(newValue);

          return;
        }

        // For number inputs
        if (newValue === '') {
          onChange?.('');

          return;
        }

        // Check if value has leading zeros (user typed them)
        const hasLeadingZero = /^0\d+/.test(newValue);

        if (isControlledNumberValue) {
          const numValue = +newValue;
          // Check bounds
          if (minNumberValue !== undefined && numValue < minNumberValue) {
            onChange?.(minNumberValue);

            return;
          }
          if (maxNumberValue !== undefined && numValue > maxNumberValue) {
            onChange?.(maxNumberValue);

            return;
          }
          // Preserve leading zeros if user typed them, otherwise return number
          onChange?.(hasLeadingZero ? newValue : numValue);
        } else {
          // For uncontrolled number values
          onChange?.(hasLeadingZero ? newValue : +newValue);
        }
      };

      if (onCustomChange) return onCustomChange(event, handleChangeLogic);

      handleChangeLogic();
    },
    [
      isNumberType,
      isControlledNumberValue,
      minNumberValue,
      maxNumberValue,
      maxLength,
      restrictExceededValueLength,
      onChange,
      onCustomChange,
    ],
  );
  const handleDebouncedChange = useMemo(
    () => debounce((event: SelectEvent) => handleChange(event), CHANGE_DEBOUNCE_VALUE),
    [handleChange],
  );
  const handleBlur: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback(
    (event) => {
      onBlur?.(event);

      if (withDebounce) {
        handleDebouncedChange.flush();
        handleDebouncedButtonChange.flush();
      }
    },
    [onBlur, withDebounce, handleDebouncedChange, handleDebouncedButtonChange],
  );

  useEffect(() => {
    if (!withDebounce || !inputRef.current || inputRef.current?.value === String(value)) return;
    inputRef.current.value = String(value ?? '');
  }, [withDebounce, value]);

  // Cleanup debounced functions on unmount
  useEffect(
    () => () => {
      handleDebouncedChange.cancel();
      handleDebouncedButtonChange.cancel();
    },
    [handleDebouncedChange, handleDebouncedButtonChange],
  );

  return (
    <Tooltip tooltipTitle={tooltip}>
      <StyledTextFieldContainer>
        <StyledTextField
          {...textFieldProps}
          {...(withDebounce ? { inputRef } : { value: getTextFieldValue() })}
          onChange={withDebounce ? handleDebouncedChange : handleChange}
          onBlur={handleBlur}
          error={error}
          helperText={helperText}
          data-testid={dataTestid}
          disabled={disabled}
          InputProps={
            isNumberType
              ? {
                  endAdornment: (
                    <StyledFlexTopCenter>
                      {getTextAdornment({ value, textAdornment, disabled })}
                      <StyledUpDown>
                        <StyledClearedButton
                          data-testid="button-arrow-up"
                          disabled={disabled}
                          onClick={handleAddNumber}
                        >
                          <Svg width={18} height={18} id="navigate-up" />
                        </StyledClearedButton>
                        <StyledClearedButton
                          data-testid="button-arrow-down"
                          disabled={disabled}
                          onClick={handleSubtractNumber}
                        >
                          <Svg width={18} height={18} id="navigate-down" />
                        </StyledClearedButton>
                      </StyledUpDown>
                    </StyledFlexTopCenter>
                  ),
                }
              : InputProps
          }
        />
        {maxLength && (
          <Counter
            hasError={!!error}
            value={value?.length || 0}
            maxLength={maxLength}
            counterProps={counterProps}
          >
            {value?.length || 0}/{maxLength} {t('characters')}
          </Counter>
        )}
        {!maxLength && !error && hintText && <StyledHint>{hintText}</StyledHint>}
      </StyledTextFieldContainer>
    </Tooltip>
  );
};
