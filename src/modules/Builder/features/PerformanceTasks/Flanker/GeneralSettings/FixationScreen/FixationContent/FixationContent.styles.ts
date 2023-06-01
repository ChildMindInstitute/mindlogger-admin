import { styled } from '@mui/material';

import { StyledClearedButton, theme, variables } from 'shared/styles';

export const StyledRemoveButton = styled(StyledClearedButton)`
  padding: ${theme.spacing(0.5)};
  margin-left: ${theme.spacing(0.2)};

  svg {
    fill: ${variables.palette.primary};
  }
`;
