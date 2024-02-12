import { Box, styled } from '@mui/material';

import { commonStickyStyles, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledContainer = styled(Box)`
  position: relative;
  overflow-y: auto;
  margin: ${theme.spacing(-2.4, -2.4, -1.6)};
  height: 100%;
`;

export const StyledForm = styled('form', shouldForwardProp)`
  ${commonStickyStyles}
  background-color: ${variables.palette.surface1};
  box-shadow: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.boxShadow.light0 : 'none'};
  padding: ${theme.spacing(2.4)};
`;

export const StyledNoteListContainer = styled(Box)`
  padding: ${theme.spacing(2.4, 0)};
  position: relative;
`;
