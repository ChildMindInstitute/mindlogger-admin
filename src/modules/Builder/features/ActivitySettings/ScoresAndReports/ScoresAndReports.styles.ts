import { Button, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledButton = styled(Button)`
  width: 19.6rem;
  margin-top: ${theme.spacing(0.8)};
  padding: ${theme.spacing(1.6)};

  svg {
    fill: ${variables.palette.primary};
  }
`;

export const StyledConfigureBtn = styled(Button)`
  font-size: ${variables.font.size.lg};
`;
