import { styled } from '@mui/system';
import { Button, Box } from '@mui/material';

import { theme, variables, StyledBodyMedium, StyledClearedButton } from 'shared/styles';

export const StyledForm = styled('form')`
  margin-top: ${theme.spacing(3.2)};
  padding: ${theme.spacing(2.4)};
  background: ${variables.palette.white};
  border-radius: ${variables.borderRadius.xl};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
`;

export const StyledResetPasswordSubheader = styled(StyledBodyMedium)`
  margin: ${theme.spacing(0.8, 0, 2.4)};
`;

export const StyledController = styled(Box)`
  margin-bottom: ${theme.spacing(2)};
`;

export const StyledButton = styled(Button)`
  width: 100%;
  margin-top: ${theme.spacing(2.2)};
`;

export const StyledBackWrapper = styled(Box)`
  text-align: center;
  margin: ${theme.spacing(2.4, 0, 0)};
`;

export const StyledBack = styled(StyledClearedButton)`
  color: ${variables.palette.primary};
  text-align: center;
  font-size: ${variables.font.size.md};
  font-weight: ${variables.font.weight.regular};
  line-height: ${variables.font.lineHeight.md};
  text-decoration: underline;

  &.MuiButton-text:hover {
    background-color: transparent;
  }
`;
