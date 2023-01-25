import { Button, styled } from '@mui/material';

import { variables } from 'styles/variables';

export const StyledButton = styled(Button)`
  font-weight: ${variables.font.weight.regular};

  :disabled {
    svg {
      fill: ${variables.palette.contained_btn_disabled_text};
    }
  }

  svg {
    fill: ${variables.palette.primary};
  }
`;
