import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';

import { variables } from 'shared/styles/variables';
import theme from 'shared/styles/theme';

export const StyledHeaderContainer = styled(Box)`
  display: grid;
  grid-template-columns: 30% 40% 30%;
  align-items: center;
  height: 9.6rem;
  padding: ${theme.spacing(2.4, 3.2)};
  border-bottom: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
`;

export const StyledBackButton = styled(Button)`
  &:hover {
    background-color: ${variables.palette.on_surface_variant_alfa8};
  }

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledCartButton = styled(Button)`
  width: 25.6rem;
  display: flex;
  justify-content: flex-start;

  .MuiButton-startIcon {
    svg {
      fill: ${variables.palette.primary};
    }
  }

  .MuiButton-endIcon {
    position: absolute;
    right: 1.4rem;

    svg {
      fill: ${variables.palette.on_surface_variant};
    }
  }
`;

export const StyledBuilderButton = styled(Button)`
  svg {
    fill: ${variables.palette.white};
  }
`;
