import { State } from '@popperjs/core';
import maxSize from 'popper-max-size-modifier';
import { useCallback, useEffect, useId, useState } from 'react';

import { StyledTooltip } from './Tooltip.styles';
import { TooltipProps } from './Tooltip.types';

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
      maxHeight: `${height - 24}px`,
    };
  },
};

const preventOverflow = {
  name: 'preventOverflow' as const,
  options: {
    padding: { top: 24, bottom: 24 },
  },
};

export const Tooltip = ({
  children,
  maxWidth,
  onClose,
  onOpen,
  open,
  tooltipTitle = '',
  ...props
}: TooltipProps) => {
  const tooltipId = useId();
  const [innerOpen, setInnerOpen] = useState(open ?? false);

  useEffect(() => {
    setInnerOpen(open ?? false);

    if (open) {
      document.dispatchEvent(new CustomEvent('tooltipOpen', { detail: tooltipId }));
    }
  }, [open, tooltipId]);

  const handleClose = useCallback(
    (e: Event | React.SyntheticEvent) => {
      onClose?.(e);

      // Only set innerOpen value if Tooltip is uncontrolled.
      // Otherwise wait for updated `open` prop.
      if (typeof open !== 'boolean') {
        setInnerOpen(false);
      }
    },
    [onClose, open],
  );

  const handleOpen = (e: React.SyntheticEvent) => {
    onOpen?.(e);

    // Only set innerOpen value if Tooltip is uncontrolled.
    if (typeof open !== 'boolean') {
      setInnerOpen(true);
      document.dispatchEvent(new CustomEvent('tooltipOpen', { detail: tooltipId }));
    }
  };

  const handleTooltipOpenEvent = useCallback(
    (e: Event) => {
      if (innerOpen && (e as CustomEvent).detail !== tooltipId) {
        handleClose(e);
      }
    },
    [tooltipId, handleClose, innerOpen],
  );

  useEffect(() => {
    document.addEventListener('tooltipOpen', handleTooltipOpenEvent);

    return () => {
      document.removeEventListener('tooltipOpen', handleTooltipOpenEvent);
    };
  }, [handleClose, handleTooltipOpenEvent, innerOpen, tooltipId]);

  return (
    <StyledTooltip
      {...props}
      open={innerOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      PopperProps={{
        ...props.PopperProps,
        modifiers: [maxSize, applyMaxSize, preventOverflow],
      }}
      title={tooltipTitle}
      sx={{
        '.MuiTooltip-tooltip': {
          maxWidth: maxWidth ?? '25rem',
        },
      }}
    >
      {children}
    </StyledTooltip>
  );
};

export const OptionalTooltipWrapper = ({ children, tooltipTitle, ...props }: TooltipProps) =>
  tooltipTitle ? (
    <Tooltip tooltipTitle={tooltipTitle} {...props}>
      {children}
    </Tooltip>
  ) : (
    children
  );
