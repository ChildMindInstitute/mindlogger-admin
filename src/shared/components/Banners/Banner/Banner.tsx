import { Alert } from '@mui/material';
import { useEffect, useState } from 'react';

import { Svg } from 'shared/components/Svg';
import { StyledClearedButton } from 'shared/styles';
import { useWindowFocus } from 'shared/hooks/useWindowFocus';

import { BannerProps } from './Banner.types';
import { BANNER_ICONS } from './Banner.const';

export const Banner = ({
  children,
  duration = 5000,
  onClose,
  hasCloseButton = !!onClose,
  severity = 'success',
  ...rest
}: BannerProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const isWindowFocused = useWindowFocus();

  // Close banner on timeout only while window is focused & banner not hovered
  // (a11y behavior adapted from MUI SnackBar)
  useEffect(() => {
    if (!duration || !onClose || isHovering || !isWindowFocused) return;

    const timeoutId = setTimeout(() => onClose?.('timeout'), duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [duration, isHovering, isWindowFocused, onClose]);

  return (
    <Alert
      iconMapping={BANNER_ICONS}
      slots={{
        closeButton: StyledClearedButton,
      }}
      slotProps={{
        closeButton: {
          children: <Svg id="close" />,
        },
      }}
      onClose={hasCloseButton ? () => onClose?.('manual') : undefined}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      severity={severity}
      data-testid={`${severity}-banner`}
      {...rest}
    >
      {children}
    </Alert>
  );
};
