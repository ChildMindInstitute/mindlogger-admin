import { styled } from '@mui/material';

import { StyledStickyHeader, theme } from 'shared/styles';

export const StyledBuilderContainerHeader = styled(StyledStickyHeader)`
  justify-content: space-between;
  white-space: nowrap;
  z-index: ${theme.zIndex.appBar};
`;
