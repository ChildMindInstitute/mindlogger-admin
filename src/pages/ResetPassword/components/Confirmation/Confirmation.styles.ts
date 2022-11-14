import { styled } from '@mui/system';
import { Box, Link } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { StyledLargeTitle, StyledSmallText } from 'styles/styledComponents/Typography';

export const StyledConfirmation = styled(Box)`
  text-align: center;
  margin-top: ${theme.spacing(3.2)};
  padding: ${theme.spacing(2.4)};
  background: ${variables.palette.shades0};
  border-radius: ${variables.borderRadius.xl};
  border: ${variables.borderWidth.md} solid ${variables.palette.shades70};
`;

export const StyledHeader = styled(StyledLargeTitle)`
  margin: ${theme.spacing(0, 0, 0.8)};
`;

export const StyledSubheader = styled(StyledSmallText)`
  margin: ${theme.spacing(0, 0, 1.2)};
`;

export const StyledInfo = styled(StyledSmallText)`
  margin: ${theme.spacing(0, 0, 2.4)};
`;

export const StyledLink = styled(Link)`
  color: ${variables.palette.primary50};
  text-decoration: underline;
`;
