import { styled } from '@mui/material';

import { commonStickyStyles, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledForm = styled('form', shouldForwardProp)`
  ${commonStickyStyles};
  background-color: ${variables.palette.surface1};
  box-shadow: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.boxShadow.light0 : 'none'};
  padding: ${theme.spacing(2.4, 2, 1.4)};
`;
