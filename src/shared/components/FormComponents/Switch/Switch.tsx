import { Controller, FieldValues } from 'react-hook-form';
import { FormControlLabel, Switch as CustomSwitch } from '@mui/material';

import { StyledFlexTopCenter, StyledTooltipSvg } from 'shared/styles';
import { Tooltip } from 'shared/components';

import { SwitchControllerProps } from './Switch.types';

export const Switch = <T extends FieldValues>({
  control,
  name,
  label,
  tooltipText,
  ...props
}: SwitchControllerProps<T>) => (
  <StyledFlexTopCenter>
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControlLabel
          label={label}
          control={<CustomSwitch {...props} {...field} checked={field.value} />}
        />
      )}
    />
    {tooltipText && (
      <Tooltip tooltipTitle={tooltipText}>
        <StyledFlexTopCenter>
          <StyledTooltipSvg id="more-info-outlined" width="20" height="20" />
        </StyledFlexTopCenter>
      </Tooltip>
    )}
  </StyledFlexTopCenter>
);
