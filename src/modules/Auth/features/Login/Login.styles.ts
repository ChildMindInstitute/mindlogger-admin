import { styled } from '@mui/system';
import { Button, Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import {
  StyledHeadline,
  StyledLabelMedium,
  StyledClearedButton,
} from 'shared/styles/styledComponents';

export const StyledWelcome = styled(StyledHeadline)`
  color: ${variables.palette.primary};
  padding: ${theme.spacing(0, 4.8)};
  text-align: center;
`;

export const StyledLoginSubheader = styled(StyledLabelMedium)`
  margin: ${theme.spacing(0.8, 0, 2.4)};
`;

export const StyledForm = styled('form')`
  margin-top: ${theme.spacing(3.2)};
  padding: ${theme.spacing(2.4)};
  background: ${variables.palette.white};
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

export const StyledForgotPasswordLink = styled(StyledClearedButton)`
  width: fit-content;
  margin: ${theme.spacing(1.2, 0, 0.8)};
  color: ${variables.palette.primary};
  font-size: ${variables.font.size.sm};
  font-weight: ${variables.font.weight.regular};
  line-height: ${variables.font.lineHeight.sm};
  text-decoration: underline;

  &.MuiButton-text:hover {
    background-color: transparent;
  }
`;

export const StyledImageContainer = styled(Box)`
  width: 4rem;
  height: 4rem;
`;

export const StyledImage = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${variables.borderRadius.half};
`;

export const StyledUserInfo = styled(Box)`
  margin-left: ${theme.spacing(1.2)};
`;
