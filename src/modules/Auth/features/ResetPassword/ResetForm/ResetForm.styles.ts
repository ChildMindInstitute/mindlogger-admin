import { styled, Button, Box } from '@mui/material';

import { theme, variables, StyledBodyMedium } from 'shared/styles';
import { AUTH_BOX_WIDTH } from 'shared/consts';

export const StyledForm = styled('form')`
  width: ${AUTH_BOX_WIDTH};
  margin-top: ${theme.spacing(3.2)};
  padding: ${theme.spacing(2.4)};
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
