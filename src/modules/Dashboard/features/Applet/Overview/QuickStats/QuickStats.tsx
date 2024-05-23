import { Box } from '@mui/material';

import { Svg } from 'shared/components';
import { StyledFlexColumn, StyledHeadlineLarge, variables } from 'shared/styles';

import { StyledRoot } from './QuickStats.styles';
import { QuickStatsProps } from './QuickStats.types';

export const QuickStats = ({ stats = [], ...otherProps }: QuickStatsProps) => (
  <StyledRoot component="ul" {...otherProps}>
    {stats.map(({ label, icon, value, sx, ...otherStatProps }, i) => (
      <StyledFlexColumn
        component="li"
        key={i}
        sx={{ gap: 1.2, flexGrow: 1, position: 'relative', ...sx }}
        {...otherStatProps}
      >
        <Svg height="24" fill={variables.palette.outline_variant} id={icon} width="24" />

        <Box component="p" sx={{ color: variables.palette.on_surface_variant, m: 0 }}>
          {label}
        </Box>

        <StyledHeadlineLarge>{value}</StyledHeadlineLarge>
      </StyledFlexColumn>
    ))}
  </StyledRoot>
);
