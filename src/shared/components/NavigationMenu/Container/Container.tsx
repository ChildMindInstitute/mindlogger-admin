import { useRef } from 'react';

import { Svg } from 'shared/components/Svg';
import { theme } from 'shared/styles/theme';
import { StyledClearedButton } from 'shared/styles/styledComponents/Buttons';
import { StyledStickyHeadline } from 'shared/styles/styledComponents/Typography';
import { useHeaderSticky } from 'shared/hooks/useHeaderSticky';

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
