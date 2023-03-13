import { styled } from '@mui/system';
import { Box, Link } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledHeadline, StyledLabelMedium } from 'shared/styles/styledComponents';

export const StyledConfirmation = styled(Box)`
  text-align: center;
  margin-top: ${theme.spacing(3.2)};
  padding: ${theme.spacing(2.4)};
  background: ${variables.palette.white};
  border-radius: ${variables.borderRadius.xl};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
`;

export const StyledHeader = styled(StyledHeadline)`
  margin: ${theme.spacing(0, 0, 0.8)};
`;

export const StyledSubheader = styled(StyledLabelMedium)`
  margin: ${theme.spacing(0, 0, 1.2)};
`;

export const StyledInfo = styled(StyledLabelMedium)`
  margin: ${theme.spacing(0, 0, 2.4)};
`;

export const StyledLink = styled(Link)`
  color: ${variables.palette.primary};
  text-decoration: underline;
`;
