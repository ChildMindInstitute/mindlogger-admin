import { styled } from '@mui/material';

import { StyledFlexTopCenter, theme, variables, commonStickyStyles } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledHeader = styled(StyledFlexTopCenter, shouldForwardProp)`
  ${({ isSticky }: { isSticky?: boolean }) =>
    isSticky !== undefined &&
    `
    ${commonStickyStyles};
    box-shadow: ${isSticky ? variables.boxShadow.light0 : 'none'};
  `}

  justify-content: space-between;
  padding: ${theme.spacing(2.4, 6.4)};
  z-index: ${theme.zIndex.appBar};
`;
