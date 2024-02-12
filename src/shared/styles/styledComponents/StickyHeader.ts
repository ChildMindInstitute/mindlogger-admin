import { styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents/Flex';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';
import { commonStickyStyles } from 'shared/styles/stylesConsts';

export const StyledStickyHeader = styled(StyledFlexTopCenter, shouldForwardProp)`
  ${commonStickyStyles};
  padding: ${theme.spacing(0, 6.4)};
  min-height: ${({ isSticky }: { isSticky?: boolean }) => (isSticky ? '5.6rem' : '9.6rem')};
  box-shadow: ${({ isSticky }) => (isSticky ? variables.boxShadow.light0 : 'none')};
`;
