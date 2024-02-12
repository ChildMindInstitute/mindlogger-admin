import { FormControlLabel, Switch } from '@mui/material';

import { StyledFlexTopCenter, StyledTooltipSvg } from 'shared/styles';
import { Tooltip } from 'shared/components/Tooltip';

import { SwitchWithStateProps } from './SwitchWithState.types';

export const SwitchWithState = ({
  checked,
  handleChange,
  label,
  tooltipText,
  'data-testid': dataTestid,
}: SwitchWithStateProps) => (
  <StyledFlexTopCenter data-testid={dataTestid}>
    <FormControlLabel
      control={<Switch checked={checked} onChange={handleChange} />}
      label={label}
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
