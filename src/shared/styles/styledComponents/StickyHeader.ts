import { styled } from '@mui/material';

import { StyledFlexTopCenter } from 'shared/styles/styledComponents/Flex';
import { shouldForwardProp } from 'shared/utils';
import { commonStickyStyles } from 'shared/styles/stylesConsts';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledStickyHeader = styled(StyledFlexTopCenter, shouldForwardProp)`
  ${commonStickyStyles};
  padding: ${theme.spacing(0, 6.4)};
  min-height: ${({ isSticky }: { isSticky: boolean }) => (isSticky ? '5.6rem' : '9.6rem')};
  box-shadow: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.boxShadow.light0 : 'none'};
`;
