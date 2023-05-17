import { Box, styled } from '@mui/material';

import { commonStickyStyles, StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledReport = styled(Box)`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export const StyledHeader = styled(StyledFlexTopCenter, shouldForwardProp)`
  ${commonStickyStyles};
  padding: ${theme.spacing(2.4, 6.4)};
  box-shadow: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.boxShadow.light0 : 'none'};
  justify-content: space-between;
`;
