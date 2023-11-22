import { Button, styled } from '@mui/material';

import { variables } from 'shared/styles/variables';

export const StyledButton = styled(Button)`
  font-weight: ${variables.font.weight.regular};

  :disabled {
    svg {
      fill: ${variables.palette.disabled};
    }
  }

  svg {
    fill: ${variables.palette.primary};
  }
`;
