import { styled } from '@mui/system';
import { Button, Box, Link } from '@mui/material';

import { variables } from 'styles/variables';

import { StyledLargeTitle, StyledSmallText } from 'styles/StyledComponents/Typography';

export const StyledSignUp = styled('div')`
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
  width: 23.5rem;
  margin: 1.5rem 0;
`;

export const StyledSignUpHeader = styled(StyledLargeTitle)`
  margin: 0 0 1.5rem;
`;

export const StyledForm = styled('form')`
  padding: 1.5rem;
  background-color: ${variables.palette.shades0};
  border-radius: 1.25rem;
`;

export const StyledController = styled(Box)`
  margin-bottom: 2.25rem;
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
  margin: 1.5rem 0;
`;

export const StyledBackWrapper = styled(Box)`
  text-align: center;
`;

export const StyledBack = styled(Button)`
  height: auto;
  padding: 0;
  color: ${variables.palette.primary50};
  text-align: center;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    background-color: transparent;
  }
`;
