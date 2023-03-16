import { Box } from '@mui/material';
import { styled } from '@mui/system';

import {
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';
import { Svg } from 'shared/components';

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

  svg {
    fill: ${variables.palette.surface_variant};
  }
`;

export const StyledNameWrapper = styled(Box)`
  font-size: ${variables.font.size.md};
  line-height: ${variables.font.lineHeight.md};
  color: ${variables.palette.on_surface_variant};
  margin-top: ${theme.spacing(1.6)};
`;

export const StyledSvg = styled(Svg)`
  fill: ${variables.palette.outline};
  margin-left: ${theme.spacing(1)};
`;

export const StyledTitle = styled(StyledTitleMedium)`
  display: flex;

  svg {
    height: 2.4rem;
    margin-left: ${theme.spacing(0.4)};
  }
`;
