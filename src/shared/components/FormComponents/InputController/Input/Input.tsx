import { ChangeEvent, useEffect, useRef } from 'react';
import { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';

import { Svg } from 'shared/components/Svg';
import { Tooltip } from 'shared/components/Tooltip';

import { StyledClearedButton } from 'shared/styles/styledComponents/Buttons';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents/Flex';

import { InputProps } from './Input.types';
import {
  StyledCounter,
  StyledTextField,
  StyledTextFieldContainer,
  StyledUpDown,
} from './Input.styles';
import { getTextAdornment } from './Input.utils';
import { INPUT_DEBOUNCE_VALUE } from './Input.const';

export const Input = <T extends FieldValues>({
  onChange,
  value,
  isEmptyStringAllowed,
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
  withDebounce,
  'data-testid': dataTestid,
  ...textFieldProps
}: InputProps<T>) => {
  const { t } = useTranslation('app');
  const inputRef = useRef<HTMLInputElement | null>();
  const isNumberType = textFieldProps.type === 'number';
  // const getTextFieldValue = () => {
  //   // if (!isNumberType) return value ?? '';
  //
  //   // if (
  //   //   (typeof value !== 'number' && !isEmptyStringAllowed) ||
  //   //   (minNumberValue !== undefined && value < minNumberValue)
  //   // ) {
  //   //   return String(minNumberValue);
  //   // }
  //   //
  //   // if (maxNumberValue !== undefined && value > maxNumberValue) {
  //   //   return String(maxNumberValue);
  //   // }
  //
  //   // return String(value);
  //
  //   return value ?? '';
  // };

  const numberValue = isNaN(+value) ? 0 : +value;
  // const numberValue = isNaN(+value) ? '' : +value;

  const handleAddNumber = () => {
    if (onArrowPress) return onArrowPress(numberValue + 1);
    if (typeof maxNumberValue !== 'number') return onChange?.(numberValue + 1);

    if (numberValue < maxNumberValue) onChange?.(numberValue + 1);
  };
  const handleDistractNumber = () => {
    if (onArrowPress) return onArrowPress(numberValue - 1);
    if (minNumberValue === undefined || numberValue > minNumberValue) onChange?.(numberValue - 1);
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onCustomChange) return onCustomChange(event);

    const newValue = event.target.value;

    if (newValue && maxLength && restrictExceededValueLength && newValue.length > maxLength) return;

    onChange?.(isNumberType ? +newValue : newValue);
  };
  const handleDebouncedChange = debounce(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(event),
    INPUT_DEBOUNCE_VALUE,
  );

  useEffect(() => {
    if (!withDebounce || !inputRef.current || inputRef.current?.value === String(value)) return;
    inputRef.current.value = value;
  });

  return (
    <Tooltip tooltipTitle={tooltip}>
      <StyledTextFieldContainer>
        <StyledTextField
          {...textFieldProps}
          {...(withDebounce ? { inputRef } : { value })}
          onChange={withDebounce ? handleDebouncedChange : handleChange}
          error={error}
          helperText={helperText}
          data-testid={dataTestid}
          InputProps={
            isNumberType
              ? {
                  endAdornment: (
                    <StyledFlexTopCenter>
                      {getTextAdornment(value, textAdornment)}
                      <StyledUpDown>
                        <StyledClearedButton onClick={handleAddNumber}>
                          <Svg width={18} height={18} id="navigate-up" />
                        </StyledClearedButton>
                        <StyledClearedButton onClick={handleDistractNumber}>
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
      </StyledTextFieldContainer>
    </Tooltip>
  );
};
