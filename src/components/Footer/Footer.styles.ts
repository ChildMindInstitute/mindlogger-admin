import { styled } from '@mui/system';
import { Box, Link } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledFooter = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4.8rem;
  font-size: ${variables.font.size.sm};
  line-height: ${variables.lineHeight.sm};
  padding: ${theme.spacing(2, 0)};
  border-top: ${variables.borderWidth.md} solid ${variables.palette.shades70};
  margin: ${theme.spacing(0, 4.4)};
`;

export const StyledText = styled(Box)`
  color: ${variables.palette.shades80};
  margin: ${theme.spacing(0, 2.4)};
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${variables.palette.shades80};
  margin: ${theme.spacing(0, 1.2)};
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
`;

export const StyledUnderlineLink = styled(StyledLink)`
  text-decoration: underline;
  color: ${variables.palette.shades80};
  margin: ${theme.spacing(0, 0.4)};

  &:hover {
    text-decoration: none;
  }
`;

export const StyledBox = styled(Box)`
  display: flex;
  align-items: center;
`;
