import { styled } from '@mui/material';

import { StyledClearedButton, variables } from 'shared/styles';

export const StyledDuplicateButton = styled(StyledClearedButton)`
  svg {
    fill: ${variables.palette.primary};
  }
`;
