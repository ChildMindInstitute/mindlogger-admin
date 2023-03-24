import { ChangeEvent } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { Tooltip, TooltipUiType } from 'shared/components/Tooltip';

import {
  StyledBodyLarge,
  StyledClearedButton,
  StyledFlexTopCenter,
} from 'shared/styles/styledComponents';

import { InputControllerProps } from './InputController.types';
import {
  StyledCounter,
  StyledTextField,
  StyledTextFieldContainer,
  StyledUpDown,
} from './InputController.styles';

export const InputController = <T extends FieldValues>({
  name,
  control,
  error: providedError,
  textAdornment,
  maxLength,
  tooltip,
  InputProps,
  minNumberValue = 1,
  maxNumberValue,
  onChange: handleCustomChange,
  helperText,
  isEmptyStringAllowed = false,
  ...textFieldProps
}: InputControllerProps<T>) => {
  const { t } = useTranslation('app');
  const isNumberType = textFieldProps.type === 'number';

  const getTextAdornment = (value: number) => {
    if (!textAdornment || !value) return null;

    return <StyledBodyLarge>{t(textAdornment, { count: value })}</StyledBodyLarge>;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const textFieldValue =
          isNumberType &&
          ((typeof value !== 'number' && !isEmptyStringAllowed) || value < minNumberValue)
            ? minNumberValue
            : value;

        const handleAddNumber = () => {
          if (typeof maxNumberValue !== 'number') return onChange(+value + 1);

          if (+value < maxNumberValue) onChange(+value + 1);
        };

        const handleDistractNumber = () => {
          if (+value > minNumberValue) onChange(+value - 1);
        };

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          if (handleCustomChange) return handleCustomChange(event);

          onChange(event.target.value);
        };

        return (
          <Tooltip uiType={TooltipUiType.Secondary} tooltipTitle={tooltip}>
            <StyledTextFieldContainer>
              <StyledTextField
                {...textFieldProps}
                onChange={handleChange}
                value={textFieldValue}
                error={!!error || providedError}
                helperText={error?.message || helperText}
                InputProps={
                  isNumberType
                    ? {
                        endAdornment: (
                          <StyledFlexTopCenter>
                            {getTextAdornment(value)}
                            <StyledUpDown>
                              <StyledClearedButton onClick={handleAddNumber}>
                                <Svg id="navigate-up" />
                              </StyledClearedButton>
                              <StyledClearedButton onClick={handleDistractNumber}>
                                <Svg id="navigate-down" />
                              </StyledClearedButton>
                            </StyledUpDown>
                          </StyledFlexTopCenter>
                        ),
                      }
                    : InputProps
                }
              />
              {maxLength && !error && (
                <StyledCounter>
                  {value?.length || 0}/{maxLength} {t('characters')}
                </StyledCounter>
              )}
            </StyledTextFieldContainer>
          </Tooltip>
        );
      }}
    />
  );
};
