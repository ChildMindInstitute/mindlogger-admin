import { Button, styled } from '@mui/material';

import { variables } from 'styles/variables';

export const StyledButton = styled(Button)`
  font-weight: ${variables.font.weight.regular};
  svg {
    fill: ${variables.palette.primary};
  }
`;
