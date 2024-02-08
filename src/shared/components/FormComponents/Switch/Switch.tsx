import { Switch as CustomSwitch } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';

import { Tooltip } from 'shared/components/Tooltip';
import { StyledFlexTopCenter, StyledTooltipSvg } from 'shared/styles';

import { StyledFormControlLabel } from './Switch.styles';
import { SwitchControllerProps } from './Switch.types';

export const Switch = <T extends FieldValues>({
  control,
  name,
  label,
  tooltipText,
  'data-testid': dataTestid,
  ...props
}: SwitchControllerProps<T>) => (
  <StyledFlexTopCenter>
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <StyledFormControlLabel
          label={label}
          control={<CustomSwitch {...props} {...field} checked={field.value} />}
          data-testid={dataTestid}
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
