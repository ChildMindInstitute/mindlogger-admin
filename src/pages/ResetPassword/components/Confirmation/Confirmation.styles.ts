import { styled } from '@mui/system';
import { Box, Link } from '@mui/material';

import { variables } from 'styles/variables';

import {
  StyledLargeTitle,
  StyledSmallText,
  StyledSmallTitle,
} from 'styles/styledComponents/Typography';

export const StyledConfirmation = styled(Box)`
  text-align: center;
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${variables.palette.shades0};
  border-radius: 1.25rem;
`;

export const StyledHeader = styled(StyledLargeTitle)`
  margin: 0 0 0.5rem;
`;

export const StyledSubheader = styled(StyledSmallText)`
  margin: 0 0 0.75rem;
`;

export const StyledInfo = styled(StyledSmallTitle)`
  margin: 0 0 1.5rem;
`;

export const StyledLink = styled(Link)`
  color: ${variables.palette.primary50};
  text-decoration: underline;
`;
