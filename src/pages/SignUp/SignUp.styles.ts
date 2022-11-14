import { styled } from '@mui/system';
import { Button, Box, Link } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { StyledLargeTitle, StyledSmallText } from 'styles/styledComponents/Typography';

export const StyledSignUp = styled(Box)`
  width: 100%;
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

export const StyledSignUpHeader = styled(StyledLargeTitle)`
  margin: ${theme.spacing(0, 0, 2.4)};
`;

export const StyledForm = styled('form')`
  padding: ${theme.spacing(2.4)};
  background-color: ${variables.palette.shades0};
  border: ${variables.borderWidth.md} solid ${variables.palette.shades70};
  border-radius: ${variables.borderRadius.lg};
`;

export const StyledController = styled(Box)`
  margin-bottom: ${theme.spacing(3.6)};
`;

export const StyledLabel = styled(StyledSmallText)`
  margin: 0;
`;

export const StyledLink = styled(Link)`
  text-decoration: underline;
  color: ${variables.palette.primary50};

  &:hover {
    text-decoration: none;
  }
`;

export const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledBackWrapper = styled(Box)`
  text-align: center;
`;

export const StyledBack = styled(Button)`
  height: auto;
  padding: 0;
  color: ${variables.palette.primary50};
  text-align: center;
  font-size: ${variables.font.size.sm};
  font-weight: ${variables.font.weight.regular};
  line-height: ${variables.lineHeight.sm};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    background-color: transparent;
  }
`;
