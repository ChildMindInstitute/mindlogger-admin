import { styled } from '@mui/system';
import { Button, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledHeadline, StyledLabelMedium } from 'styles/styledComponents/Typography';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';

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
  line-height: ${variables.lineHeight.sm};
  text-decoration: underline;

  &.MuiButton-text:hover {
    background-color: transparent;
  }
`;
