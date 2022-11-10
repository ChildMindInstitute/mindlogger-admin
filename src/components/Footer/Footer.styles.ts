import { styled } from '@mui/system';
import { Box, Link } from '@mui/material';

import { variables } from 'styles/variables';

export const StyledFooter = styled(Box)`
  text-align: center;
  font-size: ${variables.font.size.sm};
  line-height: ${variables.lineHeight.sm};
  background-color: ${variables.palette.primary50};
  padding: 1.25rem 0;
`;

export const StyledLink = styled(Link)`
  text-decoration: underline;
  color: ${variables.palette.shades0};

  &:hover {
    text-decoration: none;
  }
`;

export const StyledText = styled(Box)`
  color: ${variables.palette.shades0};
  margin: 0 1.5rem;
`;
