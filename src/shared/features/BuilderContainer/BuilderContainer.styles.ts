import { styled } from '@mui/material';

import { StyledStickyHeader } from 'shared/styles/styledComponents/StickyHeader';
import { theme } from 'shared/styles/theme';

export const StyledBuilderContainerHeader = styled(StyledStickyHeader)`
  justify-content: space-between;
  white-space: nowrap;
  z-index: ${theme.zIndex.appBar};
`;
