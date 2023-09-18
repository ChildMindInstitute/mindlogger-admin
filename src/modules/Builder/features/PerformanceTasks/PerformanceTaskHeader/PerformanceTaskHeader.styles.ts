import { Button, styled } from '@mui/material';

import { StyledFlexAllCenter, StyledFlexSpaceBetween, theme, variables } from 'shared/styles';

export const StyledWrapper = styled(StyledFlexSpaceBetween)`
  padding: ${theme.spacing(0, 2.4)};
  border-bottom: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
`;

export const StyledButton = styled(Button)`
  color: ${variables.palette.on_surface_variant};
`;

export const StyledContentWrapper = styled(StyledFlexAllCenter)`
  flex-direction: column;
  flex-grow: 1;
  padding: ${theme.spacing(0.85)};
  border-bottom: ${variables.borderWidth.lg2} solid ${variables.palette.primary};

  svg {
    fill: ${variables.palette.primary};
  }
`;
