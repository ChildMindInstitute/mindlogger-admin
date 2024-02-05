import { Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import useWindowFocus from 'use-window-focus';

import { Svg } from 'shared/components/Svg';
import { StyledClearedButton } from 'shared/styles';

import { BannerProps } from './Banner.types';

export const Banner = ({
  children,
  duration = 5000,
  onClose,
  hasCloseButton = !!onClose,
  severity,
}: BannerProps) => {
  let timeoutId: NodeJS.Timeout | undefined;
  const [isHovering, setIsHovering] = useState(false);
  const isWindowFocused = useWindowFocus();

  // Close banner on timeout only while window is focused & banner not hovered
  // (a11y behavior adapted from MUI SnackBar)
  useEffect(() => {
    if (!duration || !onClose || isHovering || !isWindowFocused) return;

    timeoutId = setTimeout(onClose, duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [duration, isHovering, isWindowFocused, onClose]);

  return (
    <Alert
      iconMapping={{
        info: getSvg('more-info-filled'),
        success: getSvg('check-circle'),
        warning: getSvg('exclamation-circle'),
        error: getSvg('exclamation-octagon'),
      }}
      slots={{
        closeButton: StyledClearedButton,
      }}
      slotProps={{
        closeButton: {
          children: <Svg id="close" />,
        },
      }}
      onClose={hasCloseButton ? onClose : undefined}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      severity={severity}
    >
      {children}
    </Alert>
  );
};

const getSvg = (id: string) => <Svg id={id} width={32} height={32} />;
