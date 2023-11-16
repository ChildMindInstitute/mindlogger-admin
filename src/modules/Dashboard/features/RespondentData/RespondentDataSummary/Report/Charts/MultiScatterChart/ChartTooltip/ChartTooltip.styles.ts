import { Box, styled } from '@mui/material';

import { variables } from 'shared/styles';

export const StyledTooltip = styled(Box)`
  max-height: 20rem;
  max-width: 20rem;
  overflow-y: auto;
  background-color: ${variables.palette.on_surface};
  border-radius: ${variables.borderRadius.xs};
`;
