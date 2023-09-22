import { styled, Button, Box } from '@mui/material';

import { variables, theme } from 'shared/styles';

export const StyledRow = styled(Box)`
  display: flex;
`;

export const StyledButton = styled(Button)`
  border-radius: ${variables.borderRadius.xxxl};
  margin-top: ${theme.spacing(2.4)};
  box-shadow: none;
`;

export const StyledResetButton = styled(StyledButton)`
  color: ${variables.palette.primary};
  border: 0.1rem solid ${variables.palette.on_surface_variant};
  margin-left: ${theme.spacing(1.2)};
`;

export const StyledTooltip = styled(Box)`
  margin-left: ${theme.spacing(0.6)};

  svg {
    fill: ${variables.palette.outline};
  }
`;
