import { Controller, FieldValues } from 'react-hook-form';

import { Svg } from 'components/Svg';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';
import { Tooltip, TooltipUiType } from 'components/Tooltip';

import { InputControllerProps } from './InputController.types';
import { StyledTextField, StyledUpDown, StyledAdornment } from './InputController.styles';

export const InputController = <T extends FieldValues>({
  name,
  control,
  error: providedError,
  endTextAdornmentSingular,
  endTextAdornmentPlural,
  tooltip,
  ...textFieldProps
}: InputControllerProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value }, fieldState: { error } }) => {
      const handleAddNumber = () => onChange(value + 1);
      const handleDistractNumber = () => {
        value > 1 && onChange(value - 1);
      };

      return (
        <Tooltip uiType={TooltipUiType.secondary} tooltipTitle={tooltip}>
          <StyledTextField
            {...textFieldProps}
            onChange={onChange}
            value={value}
            error={!!error || providedError}
            helperText={error ? error.message : null}
            InputProps={
              textFieldProps.type === 'number'
                ? {
                    endAdornment: (
                      <StyledAdornment>
                        {value && endTextAdornmentSingular && endTextAdornmentPlural && (
                          <StyledBodyLarge>
                            {value === 1 ? endTextAdornmentSingular : endTextAdornmentPlural}
                          </StyledBodyLarge>
                        )}
                        <StyledUpDown>
                          <StyledClearedButton onClick={handleAddNumber}>
                            <Svg id="navigate-up" width="11" height="11" />
                          </StyledClearedButton>
                          <StyledClearedButton onClick={handleDistractNumber}>
                            <Svg id="navigate-down" width="11" height="11" />
                          </StyledClearedButton>
                        </StyledUpDown>
                      </StyledAdornment>
                    ),
                  }
                : undefined
            }
          />
        </Tooltip>
      );
    }}
  />
);
