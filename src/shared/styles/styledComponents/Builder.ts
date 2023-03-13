import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledBuilderWrapper = styled(Box)`
  max-width: 136rem;
  width: 100%;
  margin: ${theme.spacing(0.4, 4, 0.8)};
`;

export const StyledBuilderBtn = styled(Button)`
  border: ${variables.borderWidth.md} solid ${variables.palette.outline};

  svg {
    fill: ${variables.palette.primary};
  }
`;
