import { Button } from '@mui/material';
import { styled } from '@mui/system';

import { variables } from 'styles/variables';

export const DirectoryUpButton = styled(Button)`
  color: ${variables.palette.on_surface_variant};
  font-weight: ${variables.font.weight.regular};
  position: absolute;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
