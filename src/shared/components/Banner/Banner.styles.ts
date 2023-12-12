import { Box, Link, styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { blendColorsNormal } from 'shared/utils';

export const StyledAlert = styled(Box)`
  background-color: ${blendColorsNormal(
    variables.palette.surface,
    variables.palette.yellow_alfa30,
  )};
`;

export const StyledWrapper = styled(Box)`
  min-height: 7.2rem;
  position: relative;
  color: ${variables.palette.on_surface};
  padding: ${theme.spacing(1.2, 5, 1.2, 1.6)};
  display: flex;
  align-items: center;
  justify-content: center;

  .close-btn {
    position: absolute;
    right: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const StyledAlertContent = styled(Box)`
  position: relative;
  padding-left: ${theme.spacing(3.5)};

  .svg-exclamation-circle {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    fill: ${variables.palette.yellow};
  }

  p {
    margin-right: ${theme.spacing(0.5)};
    display: inline;
  }
`;

export const StyledLink = styled(Link)`
  color: ${variables.palette.primary};
  font-size: ${variables.font.size.lg};
  line-height: ${variables.font.lineHeight.lg};
  letter-spacing: ${variables.font.letterSpacing.md};

  &:hover {
    text-decoration: none;
  }
`;
