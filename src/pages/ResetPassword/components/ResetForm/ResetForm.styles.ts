import { styled } from '@mui/system';
import { Button, Box, Typography } from '@mui/material';

import { variables } from 'styles/variables';

export const StyledForm = styled('form')`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${variables.palette.shades0};
  border-radius: ${variables.borderRadius.lg};
`;

export const StyledResetPasswordSubheader = styled(Typography)`
  font-size: ${variables.font.size.sm};
  font-weight: ${variables.font.weight.regular};
  line-height: ${variables.lineHeight.sm};
  margin: 0.5rem 0 1.5rem;
`;

export const StyledController = styled(Box)`
  margin-bottom: 2.625rem;
`;

export const StyledButton = styled(Button)`
  width: 100%;
`;

export const StyledBackWrapper = styled(Box)`
  text-align: center;
  margin: 1.5rem 0 0;
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
