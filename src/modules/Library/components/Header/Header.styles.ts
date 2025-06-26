import { Box, Button, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

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
    background-color: ${variables.palette.on_surface_variant_alpha8};
  }

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledCartButton = styled(Button)`
  width: 25.6rem;
  display: flex;
  justify-content: flex-start;
  padding: ${theme.spacing(0, 2.4)};

  .MuiButton-startIcon {
    svg {
      fill: ${variables.palette.primary};
    }
  }

  .MuiButton-endIcon {
    position: absolute;
    right: 0;
    margin-right: ${theme.spacing(2.4)};

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
