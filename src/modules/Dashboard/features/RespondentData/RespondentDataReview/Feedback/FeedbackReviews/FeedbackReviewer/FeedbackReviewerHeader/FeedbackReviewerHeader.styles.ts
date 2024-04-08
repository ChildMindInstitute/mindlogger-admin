import { Button, styled } from '@mui/material';

import { StyledFlexTopCenter, StyledFlexTopStart, theme, variables } from 'shared/styles';

export const StyledToggleButton = styled(Button)`
  padding: 0;
  height: auto;
  min-width: unset;
`;

export const StyledRemoveWrapper = styled(StyledFlexTopCenter)`
  padding-top: ${theme.spacing(2.5)};
  justify-content: flex-end;

  .MuiButton-root {
    color: ${variables.palette.on_surface_variant};

    svg {
      fill: ${variables.palette.on_surface_variant};
    }
  }
`;

export const StyledLock = styled(StyledFlexTopStart)`
  padding: ${theme.spacing(0.5)};
  border-radius: ${variables.borderRadius.half};
  transition: ${variables.transitions.bgColor};

  &:hover {
    background-color: ${variables.palette.primary_alfa8};
  }
`;
