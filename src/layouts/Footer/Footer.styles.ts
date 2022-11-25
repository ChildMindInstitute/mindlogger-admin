import { styled } from '@mui/system';
import { Box, Link } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { FOOTER_HEIGHT } from 'utils/constants';

export const StyledFooter = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${FOOTER_HEIGHT};
  font-size: ${variables.font.size.sm};
  line-height: ${variables.lineHeight.sm};
  padding: ${theme.spacing(2, 0)};
  border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
`;

export const StyledText = styled(Box)`
  color: ${variables.palette.on_surface_variant};
  margin: ${theme.spacing(0, 2.4)};
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${variables.palette.on_surface_variant};
  margin: ${theme.spacing(0, 1.2)};
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
`;

export const StyledUnderlineLink = styled(StyledLink)`
  text-decoration: underline;
  color: ${variables.palette.on_surface_variant};
  margin: ${theme.spacing(0, 0.4)};

  &:hover {
    text-decoration: none;
  }
`;

export const StyledBox = styled(Box)`
  display: flex;
  align-items: center;
`;
