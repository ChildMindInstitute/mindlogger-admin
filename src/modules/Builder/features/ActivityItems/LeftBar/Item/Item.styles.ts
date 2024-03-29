import { styled } from '@mui/material';

import {
  theme,
  variables,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledTitleBoldMedium,
  StyledTitleMedium,
  commonEllipsisStyles,
} from 'shared/styles';
import { blendColorsNormal, shouldForwardProp } from 'shared/utils';

export const StyledItem = styled(StyledFlexTopCenter, shouldForwardProp)`
  ${({
    isActive,
    hasError,
    isDragging,
    isSystem,
  }: {
    isActive?: boolean;
    hasError?: boolean;
    isDragging?: boolean;
    isSystem?: boolean;
  }) => `
      cursor: pointer;
      padding: ${theme.spacing(1.2, 1.2, 1.2, 2.2)};
      border-radius: ${variables.borderRadius.lg2};
      margin-bottom: ${theme.spacing(1.6)};
      box-shadow: ${isDragging ? variables.boxShadow.light3 : 'inherit'};
    
      svg {
        fill: ${variables.palette.on_surface_variant};
      }
    
      .svg-checkbox-multiple-filled {
        stroke: ${variables.palette.on_surface_variant};
      }

      ${isActive && `background-color: ${variables.palette.secondary_container}`};
      ${hasError && `background-color: ${variables.palette.error_container}`};
      ${
        isDragging &&
        `background-color: ${blendColorsNormal(
          variables.palette.surface,
          variables.palette.on_surface_alfa16,
        )}`
      };
      ${
        isSystem &&
        `
        background-color: ${blendColorsNormal(
          variables.palette.surface,
          variables.palette.on_surface_variant_alfa8,
        )};
        cursor: default;
      `
      };
    
      &:hover {
        ${
          !isActive &&
          !hasError &&
          !isSystem &&
          `
            background-color: ${blendColorsNormal(
              variables.palette.surface,
              variables.palette.on_surface_alfa8,
            )};
        `
        };
      }

      &:active {
        background-color: ${blendColorsNormal(
          variables.palette.surface,
          variables.palette.on_surface_alfa12,
        )};
      }
  `}
`;

export const StyledCol = styled(StyledFlexColumn)`
  margin-left: ${theme.spacing(1)};
  margin-right: ${theme.spacing(2.8)};
  flex: 1 1 100%;
  min-width: 0;
`;

export const StyledDescription = styled(StyledTitleMedium)`
  ${commonEllipsisStyles}
`;

export const StyledTitle = styled(StyledTitleBoldMedium)`
  ${commonEllipsisStyles}
`;
