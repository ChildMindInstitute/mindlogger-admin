import { Box, Link, styled } from '@mui/material';

import { FOOTER_HEIGHT } from 'shared/consts';
import { StyledFlexSpaceBetween, theme, variables } from 'shared/styles';

export const StyledFooter = styled(StyledFlexSpaceBetween)`
  align-items: center;
  height: ${FOOTER_HEIGHT};
  font-size: ${variables.font.size.body4};
  line-height: ${variables.font.lineHeight.body4};
  padding: ${theme.spacing(2, 0)};
  border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  background-color: ${variables.palette.surface};
  z-index: 1;
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
