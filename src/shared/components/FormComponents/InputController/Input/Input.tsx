import { useEffect, useRef, FocusEventHandler } from 'react';
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

  const handleAddNumber = () => {
    if (onArrowPress) return onArrowPress(numberValue + 1, ArrowPressType.Add);
    if (maxNumberValue === undefined || numberValue < maxNumberValue) {
      onChange?.(numberValue + 1);
    }
  };
  const handleSubtractNumber = () => {
    if (onArrowPress) return onArrowPress(numberValue - 1, ArrowPressType.Subtract);
    if (minNumberValue === undefined || numberValue > minNumberValue) {
      onChange?.(numberValue - 1);
    }
  };
  const handleChange = (event: SelectEvent) => {
    if (onCustomChange) return onCustomChange(event);
    const newValue = event.target.value;
    if (restrictExceededValueLength && newValue && maxLength && newValue.length > maxLength) return;
    const getNumberValue = () => {
      if (!isNumberType) return undefined;
      if (isControlledNumberValue) return +newValue;

      return newValue === '' ? '' : +newValue;
    };

    onChange?.(getNumberValue() ?? newValue);
  };
  const handleDebouncedChange = debounce(
    (event: SelectEvent) => handleChange(event),
    CHANGE_DEBOUNCE_VALUE,
  );
  const handleBlur: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    onBlur?.(event);

    if (withDebounce) {
      handleDebouncedChange.flush();
    }
  };

  useEffect(() => {
    if (!withDebounce || !inputRef.current || inputRef.current?.value === String(value)) return;
    inputRef.current.value = value ?? '';
  }, [withDebounce, inputRef.current, value]);

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
