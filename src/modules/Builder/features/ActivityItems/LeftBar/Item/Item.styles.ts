import { styled } from '@mui/system';

import {
  theme,
  variables,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledTitleBoldMedium,
  StyledTitleMedium,
  commonEllipsisStyles,
} from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledItem = styled(StyledFlexTopCenter, shouldForwardProp)`
  ${({
    isActive,
    hasError,
    isDragging,
  }: {
    isActive: boolean;
    hasError: boolean;
    isDragging: boolean;
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

      ${isActive && `background-color: ${variables.palette.secondary_container}`};
      ${hasError && `background-color: ${variables.palette.error_container}`};
      ${isDragging && `background-color: ${variables.palette.surface}`};
    
      &:hover {
        ${
          !isActive &&
          !hasError &&
          `
            background-color: ${variables.palette.surface_variant_alfa8};
        `
        };
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
