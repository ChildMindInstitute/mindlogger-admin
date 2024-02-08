import { styled, Button, Box, Link } from '@mui/material';

import { AUTH_BOX_WIDTH } from 'shared/consts';
import { theme, variables, StyledHeadline, StyledBodyMedium } from 'shared/styles';

export const StyledSignUpHeader = styled(StyledHeadline)`
  margin: ${theme.spacing(0, 0, 2.4)};
`;

export const StyledForm = styled('form')`
  width: ${AUTH_BOX_WIDTH};
  padding: ${theme.spacing(2.4)};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.xl};
`;

export const StyledController = styled(Box)`
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledLabel = styled(StyledBodyMedium)`
  color: ${variables.palette.on_surface};
  margin: 0;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${variables.palette.primary};

  &:hover {
    text-decoration: underline;
  }
`;

export const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledBackWrapper = styled(Box)`
  text-align: center;
`;
