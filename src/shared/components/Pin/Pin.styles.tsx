import { Button, styled } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledPinButton = styled(Button, shouldForwardProp)`
  width: 4rem;
  height: 4rem;
  min-width: 4rem;
  padding: 0;
  border-radius: ${variables.borderRadius.half};

  && .MuiTouchRipple-child {
    background-color: ${variables.palette.on_surface_variant_alpha12};
  }

  :hover,
  :focus {
    background: ${variables.palette.on_surface_variant_alpha8};

    && svg {
      fill: ${({ isPinned = false }: { isPinned?: boolean }) =>
        isPinned ? variables.palette.on_surface_variant : variables.palette.outline_variant};
    }
  }

  && svg {
    fill: ${({ isPinned = false }: { isPinned?: boolean }) =>
      isPinned ? variables.palette.on_surface_variant : variables.palette.surface_variant};
  }
`;
