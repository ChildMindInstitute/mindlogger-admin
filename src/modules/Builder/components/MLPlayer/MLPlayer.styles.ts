import { Box, Slider, styled } from '@mui/material';

import {
  StyledEllipsisText,
  StyledFlexAllCenter,
  StyledFlexTopCenter,
  StyledFlexTopStart,
  theme,
  variables,
} from 'shared/styles';

export const StyledPlayerWrapper = styled(Box)`
  position: relative;
`;
export const StyledHeader = styled(StyledFlexAllCenter)`
  position: relative;

  svg {
    fill: ${variables.palette.primary};
  }
`;
export const StyledName = styled(StyledEllipsisText)`
  color: ${variables.palette.primary};
  font-weight: ${variables.font.weight.bold};
  max-width: 17rem;
`;

export const StyledNameWrapper = styled(StyledFlexTopCenter)`
  font-size: ${variables.font.size.label3};
  color: ${variables.palette.on_surface_variant};
  display: flex;
  position: absolute;
  top: 0;
  max-width: 45%;

  svg.svg-check {
    fill: ${variables.palette.primary};
    margin-right: ${theme.spacing(0.7)};
  }
`;

export const StyledFooter = styled(StyledFlexTopStart)`
  justify-content: space-between;
`;

export const StyledSlider = styled(Slider)`
  .MuiSlider-thumb {
    display: none;
  }

  .MuiSlider-track {
    height: 0.2rem;
    color: ${variables.palette.primary};
  }
`;
