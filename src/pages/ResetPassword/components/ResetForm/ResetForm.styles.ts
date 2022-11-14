import { styled } from '@mui/system';
import { Button, Box, Typography } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledForm = styled('form')`
  margin-top: ${theme.spacing(3.2)};
  padding: ${theme.spacing(2.4)};
  background: ${variables.palette.shades0};
  border-radius: ${variables.borderRadius.lg};
  border: ${variables.borderWidth.md} solid ${variables.palette.shades70};
`;

export const StyledResetPasswordHeader = styled(Typography)`
  font-size: ${variables.font.size.xl};
  font-weight: ${variables.font.weight.medium};
  line-height: ${variables.lineHeight.xl};
  margin: 0;
`;

export const StyledResetPasswordSubheader = styled(Typography)`
  font-size: ${variables.font.size.sm};
  font-weight: ${variables.font.weight.regular};
  line-height: ${variables.lineHeight.sm};
  margin: ${theme.spacing(0.8, 0, 2.4)};
`;

export const StyledController = styled(Box)`
  margin-bottom: ${theme.spacing(4.2)};
`;

export const StyledButton = styled(Button)`
  width: 100%;
`;

export const StyledBackWrapper = styled(Box)`
  text-align: center;
  margin: ${theme.spacing(2.4, 0, 0)};
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
