import { Button } from '@mui/material';
import { styled } from '@mui/system';

import { variables } from 'shared/styles/variables';

export const StyledDirectoryUpButton = styled(Button)`
  color: ${variables.palette.on_surface_variant};
  font-weight: ${variables.font.weight.regular};
  position: absolute;
  left: 2.4rem;
  top: 1rem;
  z-index: 1;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
