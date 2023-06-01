import { Button, styled } from '@mui/material';

import { StyledFlexSpaceBetween, theme, variables } from 'shared/styles';

export const StyledWrapper = styled(StyledFlexSpaceBetween)`
  padding: ${theme.spacing(0.85, 2.4)};
  border-bottom: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
`;

export const StyledButton = styled(Button)`
  color: ${variables.palette.on_surface_variant};
`;
