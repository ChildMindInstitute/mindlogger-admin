import { Controller, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Svg, Tooltip, TooltipUiType } from 'components';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

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
  ...textFieldProps
}: InputControllerProps<T>) => {
  const { t } = useTranslation('app');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleAddNumber = () => onChange(+value + 1);
        const handleDistractNumber = () => {
          +value > 1 && onChange(+value - 1);
        };

        return (
          <Tooltip uiType={TooltipUiType.Secondary} tooltipTitle={tooltip}>
            <StyledTextFieldContainer>
              <StyledTextField
                {...textFieldProps}
                onChange={onChange}
                value={textFieldProps.type === 'number' && value < 1 ? 1 : value}
                error={!!error || providedError}
                helperText={error?.message || null}
                InputProps={
                  textFieldProps.type === 'number'
                    ? {
                        endAdornment: (
                          <StyledFlexTopCenter>
                            {value && textAdornment && (
                              <StyledBodyLarge>
                                {t(textAdornment, { count: value })}
                              </StyledBodyLarge>
                            )}
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
