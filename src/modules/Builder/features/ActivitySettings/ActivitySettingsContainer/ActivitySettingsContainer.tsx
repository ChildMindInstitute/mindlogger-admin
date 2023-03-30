import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledClearedButton, StyledHeadlineLarge, theme } from 'shared/styles';
import { useHeaderSticky } from 'shared/hooks';

import {
  StyledHeader,
  StyledContent,
  StyledActivitySettingsContainer,
} from './ActivitySettingsContainer.styles';
import { ActivitySettingsContainerProps } from './ActivitySettingsContainer.types';

export const ActivitySettingsContainer = ({
  title,
  onClose,
  children,
}: ActivitySettingsContainerProps) => {
  const containerRef = useRef<HTMLElement | null>(null);

  const isHeaderSticky = useHeaderSticky(containerRef);

  return (
    <StyledActivitySettingsContainer ref={containerRef}>
      <StyledHeader isSticky={isHeaderSticky}>
        <StyledHeadlineLarge>{title}</StyledHeadlineLarge>
        <StyledClearedButton sx={{ p: theme.spacing(1) }} onClick={onClose}>
          <Svg id="close" />
        </StyledClearedButton>
      </StyledHeader>
      <StyledContent>{children}</StyledContent>
    </StyledActivitySettingsContainer>
  );
};
