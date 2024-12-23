import { RadioGroup, Radio } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import uniqueId from 'lodash.uniqueid';

import { StyledFlexTopCenter, StyledTooltipSvg } from 'shared/styles';
import { Tooltip } from 'shared/components/Tooltip';

import { RadioGroupControllerProps } from './RadioGroupController.types';
import { StyledFormControlLabel } from './RadioGroupController.styles';

export const RadioGroupController = <T extends FieldValues>({
  name,
  control,
  options,
  defaultValue,
  onChange,
  'data-testid': dataTestid,
}: RadioGroupControllerProps<T>) => (
  <Controller
    control={control}
    name={name}
    defaultValue={defaultValue}
    render={({ field }) => (
      <RadioGroup
        {...field}
        data-testid={dataTestid}
        onChange={(event, value) => {
          if (onChange) {
            onChange(event, value, field.onChange);
          }

          field.onChange(event, value);
        }}
      >
        {options?.map(({ value, label, disabled, tooltipText }, index) => (
          <StyledFlexTopCenter sx={{ gap: 0.8 }} key={uniqueId()}>
            <StyledFormControlLabel
              value={value}
              sx={{ display: 'flex', gap: 0.8 }}
              control={<Radio sx={{ padding: '12px' }} />}
              label={label}
              checked={value === field.value}
              disabled={disabled}
              data-testid={`${dataTestid}-${index}`}
            />
            {tooltipText && (
              <Tooltip tooltipTitle={tooltipText}>
                <StyledFlexTopCenter>
                  <StyledTooltipSvg id="more-info-outlined" width="18" height="18" sx={{ ml: 0 }} />
                </StyledFlexTopCenter>
              </Tooltip>
            )}
          </StyledFlexTopCenter>
        ))}
      </RadioGroup>
    )}
  />
);
