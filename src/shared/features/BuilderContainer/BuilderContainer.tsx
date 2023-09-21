import { useRef } from 'react';

import { useHeaderSticky } from 'shared/hooks';
import { StyledBuilderWrapper, StyledFlexColumn, StyledHeadlineLarge, theme } from 'shared/styles';

import { BuilderContainerProps } from './BuilderContainer.types';
import { StyledBuilderContainerHeader } from './BuilderContainer.styles';

export const BuilderContainer = ({
  title,
  Header,
  children,
  headerProps,
  sxProps,
  contentSxProps,
  hasMaxWidth,
}: BuilderContainerProps) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);

  const HeaderComponent = Header || StyledBuilderContainerHeader;

  return (
    <StyledBuilderWrapper ref={containerRef} hasMaxWidth={hasMaxWidth} sx={sxProps}>
      <HeaderComponent isSticky={isHeaderSticky} headerProps={headerProps}>
        <StyledHeadlineLarge>{title}</StyledHeadlineLarge>
      </HeaderComponent>
      <StyledFlexColumn sx={{ padding: theme.spacing(1.6, 6.4, 2.4), ...contentSxProps }}>
        {children}
      </StyledFlexColumn>
    </StyledBuilderWrapper>
  );
};
