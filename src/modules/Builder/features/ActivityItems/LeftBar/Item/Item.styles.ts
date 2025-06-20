import { styled } from '@mui/material';

import {
  StyledBodyLarge,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledTitleBoldMedium,
  commonEllipsisStyles,
  theme,
  variables,
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
      box-shadow: ${isDragging ? variables.boxShadow.light5 : 'inherit'};
    
      svg {
        fill: ${variables.palette.on_surface_variant};
      }
    
      .svg-checkbox-multiple-filled {
        stroke: ${variables.palette.on_surface_variant};
      }

      ${isActive && `background-color: ${variables.palette.secondary_container};`}
      ${hasError && `background-color: ${variables.palette.error_container};`}
      ${
        isDragging &&
        `background-color: ${blendColorsNormal(
          variables.palette.surface,
          variables.palette.on_surface_alpha16,
        )}`
      };
      ${
        isSystem &&
        `
        background-color: ${blendColorsNormal(
          variables.palette.surface,
          variables.palette.on_surface_variant_alpha8,
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
            background-color: ${variables.palette.on_surface_alpha8};
        `
        };
      }

      &:active {
        background-color: ${variables.palette.on_surface_alpha12};
      }
  `}
`;

export const StyledCol = styled(StyledFlexColumn)`
  margin-left: ${theme.spacing(1)};
  margin-right: ${theme.spacing(2.8)};
  flex: 1 1 100%;
  min-width: 0;
`;

export const StyledDescription = styled(StyledBodyLarge)`
  ${commonEllipsisStyles}
`;

export const StyledTitle = styled(StyledTitleBoldMedium)`
  ${commonEllipsisStyles}
`;
