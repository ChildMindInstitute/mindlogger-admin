import { styled } from '@mui/material';

import { variables, StyledIconButton } from 'shared/styles';

export const StyledButton = styled(StyledIconButton)`
  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
