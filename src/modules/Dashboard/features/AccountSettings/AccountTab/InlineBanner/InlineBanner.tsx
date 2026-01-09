import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { Svg } from 'shared/components';

import { StyledInlineBanner, StyledBannerContent, StyledBannerText } from './InlineBanner.styles';

export interface InlineBannerProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const InlineBanner = ({ message, duration = 5000, onClose }: InlineBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!duration || !onClose) return;

    const timeoutId = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timeoutId);
  }, [duration, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <StyledInlineBanner data-testid="inline-mfa-banner">
      <StyledBannerContent>
        <Box sx={{ flexShrink: 0 }}>
          <Svg id="check-circle" width={32} height={32} />
        </Box>
        <StyledBannerText>{message}</StyledBannerText>
      </StyledBannerContent>
    </StyledInlineBanner>
  );
};
