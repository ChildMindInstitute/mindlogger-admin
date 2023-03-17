import { styled } from '@mui/system';
import { Box } from '@mui/material';

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
  font-size: ${variables.font.size.md};
  color: ${variables.palette.on_surface_variant};
  display: flex;
  position: absolute;
  top: 0;

  && {
    svg.svg-check {
      fill: ${variables.palette.primary};
      margin-right: ${theme.spacing(1)};
    }
  }
`;

export const StyledFooter = styled(StyledFlexTopStart)`
  justify-content: space-between;
`;
