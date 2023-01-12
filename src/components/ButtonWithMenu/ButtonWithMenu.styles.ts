import { Button, styled } from '@mui/material';

import { variables } from 'styles/variables';

export const StyledButton = styled(Button)`
  font-weight: 400;
  svg {
    fill: ${variables.palette.primary};
  }
`;
