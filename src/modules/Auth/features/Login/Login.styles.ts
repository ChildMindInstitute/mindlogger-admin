import { styled, Button, Box } from '@mui/material';

import {
  theme,
  variables,
  StyledHeadline,
  StyledLinkBtn,
  StyledBodyMedium,
  StyledFlexAllCenter,
} from 'shared/styles';

export const StyledWelcome = styled(StyledHeadline)`
  color: ${variables.palette.primary};
  padding: ${theme.spacing(0, 3.2)};
  text-align: center;
`;

export const StyledLoginSubheader = styled(StyledBodyMedium)`
  margin: ${theme.spacing(0.8, 0, 2.4)};
`;

export const StyledForm = styled('form')`
  margin-top: ${theme.spacing(3.2)};
  padding: ${theme.spacing(2.4)};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.xl};
`;

export const StyledController = styled(Box)`
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledUserInfoController = styled(StyledController)`
  display: flex;
  width: 100%;
`;

export const StyledButton = styled(Button)`
  width: 100%;
  margin-top: ${theme.spacing(2.4)};
`;

export const StyledForgotPasswordLink = styled(StyledLinkBtn)`
  margin: ${theme.spacing(1.2, 0, 0.8)};
`;

export const StyledImageContainer = styled(StyledFlexAllCenter)`
  width: 4rem;
  height: 4rem;
  background-color: ${variables.palette.primary_container};
  border-radius: ${variables.borderRadius.half};
`;

export const StyledUserInfo = styled(Box)`
  margin-left: ${theme.spacing(1.2)};
`;
