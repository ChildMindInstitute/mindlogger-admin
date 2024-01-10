import { Box, styled } from '@mui/material';

import { StyledFlexTopCenter, variables } from 'shared/styles';

export const StyledTooltip = styled(StyledFlexTopCenter)`
  max-width: 20rem;
  transform: translate(0, -100%);
  background-color: ${variables.palette.on_surface};
  border-radius: ${variables.borderRadius.xs};
`;

export const StyledBackground = styled(Box)`
  flex-shrink: 0;
  width: 1.2rem;
  height: 1.2rem;
`;
