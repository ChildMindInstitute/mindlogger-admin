import { Svg, Tooltip } from 'shared/components';
import {
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledFlexSpaceBetween,
  StyledTitleBoldLarge,
  StyledTitleMedium,
  variables,
} from 'shared/styles';

import { StyledRoot } from './QuickStats.styles';
import { QuickStatsProps } from './QuickStats.types';

export const QuickStats = ({ stats = [], sx, ...otherProps }: QuickStatsProps) => (
  <StyledRoot
    component="ul"
    sx={{
      gridTemplateColumns: `repeat(${stats.length <= 2 ? 4 : Math.min(5, stats.length)}, 1fr)`,
      ...sx,
    }}
    {...otherProps}
  >
    {stats.map(({ children, label, sx, tooltip, value, ...otherStatProps }, i) => (
      <StyledFlexSpaceBetween
        component="li"
        key={i}
        sx={{ gap: 0.8, position: 'relative', ...sx }}
        {...otherStatProps}
      >
        <StyledFlexColumn sx={{ gap: 0.8 }}>
          <StyledTitleMedium
            color={variables.palette.on_surface_variant}
            sx={{ display: 'flex', gap: 0.8, placeItems: 'center' }}
          >
            {label}

            {tooltip && (
              <Tooltip tooltipTitle={tooltip}>
                <StyledFlexAllCenter component="span">
                  <Svg aria-hidden id="more-info-outlined" height={16} width={16} />
                </StyledFlexAllCenter>
              </Tooltip>
            )}
          </StyledTitleMedium>

          <StyledTitleBoldLarge>{value}</StyledTitleBoldLarge>
        </StyledFlexColumn>

        {children}
      </StyledFlexSpaceBetween>
    ))}
  </StyledRoot>
);
