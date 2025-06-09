import { Box, styled } from '@mui/material';

import {
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledContainer = styled(StyledFlexAllCenter, shouldForwardProp)`
  cursor: pointer;

  ${({ height, width }: { height: number; width: number }) => `
      height: ${height}rem;
      width: ${width}rem;
      border: ${variables.borderWidth.lg} dashed ${variables.palette.outline_variant};
      border-radius: ${variables.borderRadius.lg2};
    `}
`;

export const StyledSourceContainer = styled(StyledFlexColumn, shouldForwardProp)`
  align-items: center;

  span {
    color: ${variables.palette.primary};
  }

  svg .svg-audio-player-filled {
    fill: ${variables.palette.surface_variant};
  }
`;

export const StyledNameWrapper = styled(Box)`
  font-size: ${variables.font.size.label3};
  line-height: ${variables.font.lineHeight.label3};
  color: ${variables.palette.on_surface_variant};
  margin-top: ${theme.spacing(1.6)};
`;

export const StyledTitle = styled(StyledTitleMedium)`
  display: flex;

  svg {
    height: 2.4rem;
    margin-left: ${theme.spacing(0.4)};
  }
`;

export const StyledPreview = styled(StyledFlexTopCenter)`
  svg {
    fill: ${variables.palette.primary};
    margin-right: ${theme.spacing(1)};
  }
`;
