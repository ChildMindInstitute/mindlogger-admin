import { styled, Box } from '@mui/material';

import { variables, theme } from 'shared/styles';

export const StyledRow = styled(Box)`
  display: flex;
  margin-top: ${theme.spacing(2.4)};
`;

export const StyledTooltip = styled(Box)`
  display: flex;
  margin-left: ${theme.spacing(0.6)};

  svg {
    fill: ${variables.palette.outline};
  }
`;
