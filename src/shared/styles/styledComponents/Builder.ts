import { Box, Button, styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledBuilderWrapper = styled(Box)`
  overflow-y: auto;
  margin: ${theme.spacing(-2.4, -2.4, 0)};
`;

export const StyledBuilderBtn = styled(Button)`
  border: ${variables.borderWidth.md} solid ${variables.palette.outline};

  svg {
    fill: ${variables.palette.primary};
  }
`;
