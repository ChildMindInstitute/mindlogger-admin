import { Controller, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { Tooltip, TooltipUiType } from 'components/Tooltip';

import { InputControllerProps } from './InputController.types';
import { StyledTextField, StyledUpDown } from './InputController.styles';

export const InputController = <T extends FieldValues>({
  name,
  control,
  error: providedError,
  textAdornment,
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
          <Tooltip uiType={TooltipUiType.secondary} tooltipTitle={tooltip}>
            <StyledTextField
              {...textFieldProps}
              onChange={onChange}
              value={textFieldProps.type === 'number' && value < 1 ? 1 : value}
              error={!!error || providedError}
              helperText={error ? error.message : null}
              InputProps={
                textFieldProps.type === 'number'
                  ? {
                      endAdornment: (
                        <StyledFlexTopCenter>
                          {value && textAdornment && (
                            <StyledBodyLarge>{t(textAdornment, { count: value })}</StyledBodyLarge>
                          )}
                          <StyledUpDown>
                            <StyledClearedButton onClick={handleAddNumber}>
                              <Svg id="navigate-up" width="11" height="11" />
                            </StyledClearedButton>
                            <StyledClearedButton onClick={handleDistractNumber}>
                              <Svg id="navigate-down" width="11" height="11" />
                            </StyledClearedButton>
                          </StyledUpDown>
                        </StyledFlexTopCenter>
                      ),
                    }
                  : InputProps
              }
            />
          </Tooltip>
        );
      }}
    />
  );
};
