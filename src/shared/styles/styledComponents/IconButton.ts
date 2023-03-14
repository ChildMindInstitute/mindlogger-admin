import { styled } from '@mui/material';

import { StyledClearedButton, variables } from 'shared/styles';

export const StyledIconButton = styled(StyledClearedButton)`
  width: 4rem;
  height: 4rem;

  svg:hover {
    fill: ${variables.palette.primary};
  }
`;
