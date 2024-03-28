import { styled } from '@mui/material';

import { StyledStickyHeader } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledHeader = styled(StyledStickyHeader, shouldForwardProp)`
  justify-content: space-between;
`;
