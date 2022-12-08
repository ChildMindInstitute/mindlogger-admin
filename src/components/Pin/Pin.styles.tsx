import { Button } from '@mui/material';
import { styled } from '@mui/system';

import { variables } from 'styles/variables';

export const StyledPinButton = styled(Button)`
  width: 4rem;
  height: 4rem;
  min-width: 4rem;
  padding: 0;
  border-radius: ${variables.borderRadius.half};

  && .MuiTouchRipple-child {
    background-color: ${variables.palette.on_surface_variant_alfa12};
  }

  :hover {
    background: ${variables.palette.on_surface_variant_alfa8};

    svg {
      fill: ${variables.palette.on_surface_variant};
    }
  }

  svg {
    fill: ${({ isPinned = false }: { isPinned?: boolean }) =>
      isPinned ? variables.palette.on_surface_variant : variables.palette.surface_variant};
  }
`;
