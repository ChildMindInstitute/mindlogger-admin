import { State } from '@popperjs/core';
import maxSize from 'popper-max-size-modifier';

import { TooltipProps } from './Tooltip.types';
import { StyledTooltip } from './Tooltip.styles';

const applyMaxSize = {
  name: 'applyMaxSize' as const,
  enabled: true,
  phase: 'beforeWrite' as const,
  requires: ['maxSize'],
  fn: ({ state }: { state: State }) => {
    const { height } = state.modifiersData.maxSize;

    state.styles.popper = {
      ...state.styles.popper,
      display: 'flex',
      placeItems: state.placement.includes('bottom') ? 'flex-start' : 'flex-end',
      height: `${height - 24}px`,
    };
  },
};

export const Tooltip = ({ tooltipTitle = '', children, maxWidth, ...props }: TooltipProps) => (
  <StyledTooltip
    {...props}
    PopperProps={{ ...props.PopperProps, modifiers: [maxSize, applyMaxSize] }}
    title={tooltipTitle}
    sx={{
      '.MuiTooltip-tooltip': {
        maxWidth: maxWidth ?? '24rem',
      },
    }}
  >
    {children}
  </StyledTooltip>
);
