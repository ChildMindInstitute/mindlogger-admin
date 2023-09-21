import { useRef } from 'react';

import { Svg } from 'shared/components';
import { StyledClearedButton, StyledStickyHeadline, theme } from 'shared/styles';
import { useHeaderSticky } from 'shared/hooks';

import { StyledHeader, StyledContent, StyledActivitySettingsContainer } from './Container.styles';
import { ActivitySettingsContainerProps } from './Container.types';

export const Container = ({ title, onClose, children }: ActivitySettingsContainerProps) => {
  const containerRef = useRef<HTMLElement | null>(null);

  const isHeaderSticky = useHeaderSticky(containerRef);

  return (
    <StyledActivitySettingsContainer ref={containerRef}>
      <StyledHeader isSticky={isHeaderSticky}>
        <StyledStickyHeadline isSticky={isHeaderSticky}>{title}</StyledStickyHeadline>
        <StyledClearedButton sx={{ p: theme.spacing(1) }} onClick={onClose}>
          <Svg id="close" />
        </StyledClearedButton>
      </StyledHeader>
      <StyledContent>{children}</StyledContent>
    </StyledActivitySettingsContainer>
  );
};
