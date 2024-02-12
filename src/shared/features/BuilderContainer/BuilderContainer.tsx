import { useRef } from 'react';

import { useHeaderSticky } from 'shared/hooks';
import { StyledBuilderWrapper } from 'shared/styles/styledComponents/Builder';
import { StyledFlexColumn } from 'shared/styles/styledComponents/Flex';
import { StyledHeadlineLarge } from 'shared/styles/styledComponents/Typography';
import { theme } from 'shared/styles/theme';

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
  contentClassName,
}: BuilderContainerProps) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);

  const HeaderComponent = Header || StyledBuilderContainerHeader;

  return (
    <StyledBuilderWrapper ref={containerRef} hasMaxWidth={hasMaxWidth} sx={sxProps}>
      <HeaderComponent isSticky={isHeaderSticky} headerProps={headerProps}>
        <StyledHeadlineLarge>{title}</StyledHeadlineLarge>
      </HeaderComponent>
      <StyledFlexColumn
        sx={{ padding: theme.spacing(1.6, 6.4, 2.4), ...contentSxProps }}
        className={contentClassName}
      >
        {children}
      </StyledFlexColumn>
    </StyledBuilderWrapper>
  );
};
