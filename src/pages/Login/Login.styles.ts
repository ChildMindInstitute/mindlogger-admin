import { styled } from '@mui/system';
import { Button, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { StyledLargeTitle, StyledSmallText } from 'styles/styledComponents/Typography';

export const StyledLogin = styled(Box)`
  width: 100%;
  background-color: ${variables.palette.shadesBG};
`;

export const StyledContainerWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const StyledContainer = styled(Box)`
  width: 37.6rem;
  margin: ${theme.spacing(2.4, 0)};
`;

export const StyledWelcome = styled(StyledLargeTitle)`
  color: ${variables.palette.primary50};
  padding: ${theme.spacing(0, 4.8)};
  text-align: center;
`;

export const StyledLoginSubheader = styled(StyledSmallText)`
  margin: ${theme.spacing(0.8, 0, 2.4)};
`;

export const StyledForm = styled('form')`
  margin-top: ${theme.spacing(3.2)};
  padding: ${theme.spacing(2.4)};
  background: ${variables.palette.shades0};
  border-radius: ${variables.borderRadius.lg};
`;

export const StyledController = styled(Box)`
  margin-bottom: ${theme.spacing(3.6)};
`;

export const StyledButton = styled(Button)`
  width: 100%;
`;

export const StyledForgotPasswordLink = styled(Button)`
  height: auto;
  padding: 0;
  width: fit-content;
  margin: ${theme.spacing(2.4, 0)};
  color: ${variables.palette.primary50};
  font-size: ${variables.font.size.sm};
  font-weight: ${variables.font.weight.regular};
  line-height: ${variables.lineHeight.sm};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    background-color: transparent;
  }
`;
