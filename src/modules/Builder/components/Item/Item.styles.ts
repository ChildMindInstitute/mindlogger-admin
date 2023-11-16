import { Box, styled } from '@mui/material';

import {
  commonEllipsisStyles,
  StyledBodyLarge,
  StyledFlexTopCenter,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { blendColorsNormal, shouldForwardProp } from 'shared/utils';

import { ItemUiType } from './Item.types';

export const StyledItem = styled(StyledFlexTopCenter, shouldForwardProp)`
  ${({
    uiType,
    onClick,
    hasError,
    isDragging,
  }: {
    uiType: ItemUiType;
    onClick?: () => void;
    hasError?: boolean;
    isDragging?: boolean;
  }) => {
    let bgColor = 'inherit';
    if (isDragging) {
      bgColor = blendColorsNormal(
        variables.palette.surface,
        variables.palette.on_surface_alfa16,
      ) as string;
    }
    if (hasError) {
      bgColor = variables.palette.error_container;
    }

    return `
      justify-content: space-between;
      margin-bottom: ${theme.spacing(1.6)};
      padding: ${theme.spacing(1.3, 2.4)};
      width: 100%;
      border-radius: ${variables.borderRadius.lg2};
      height: ${
        uiType === ItemUiType.Activity || uiType === ItemUiType.FlowBuilder ? '9.8rem' : '7.2rem'
      };
      transition: ${variables.transitions.all};
      cursor: ${onClick ? 'pointer' : 'default'};
      background-color: ${bgColor};
      pointer-events: ${isDragging ? 'none' : 'auto'};
      box-shadow: ${isDragging ? variables.boxShadow.light3 : 'inherit'};
    
      &:hover {
        background-color:  ${blendColorsNormal(
          variables.palette.surface,
          variables.palette.on_surface_alfa8,
        )};
        
        .item-name {
          font-weight: ${uiType === ItemUiType.Flow ? variables.font.weight.bold : 'inherit'};
        } 
      }

      &:active {
        background-color: ${blendColorsNormal(
          variables.palette.surface,
          variables.palette.on_surface_alfa12,
        )};
      }
  `;
  }}
`;

export const StyledCol = styled(Box, shouldForwardProp)`
  width: ${({ hasImage }: { hasImage: boolean }) =>
    `calc(100% - ${hasImage ? '32.4rem' : '24rem'})`};
  padding-right: ${theme.spacing(1)};
`;

export const StyledActions = styled(StyledFlexTopCenter)`
  flex-grow: 1;
  height: 2.4rem;
`;

const commonImgStyles = `
  margin-right: ${theme.spacing(1.2)};
  border-radius: ${variables.borderRadius.lg};
  width: 7.2rem;
  height: 7.2rem;
  flex: 0 0 7.2rem;
`;

export const StyledImg = styled('img')`
  ${commonImgStyles};
`;

export const StyledImgPlaceholder = styled(Box)`
  ${commonImgStyles};
  background-color: ${variables.palette.primary_container};
`;

export const StyledFlowDescription = styled(StyledBodyLarge)`
  width: 100%;
  ${commonEllipsisStyles};
`;

export const StyledActivityDescription = styled(StyledTitleMedium)`
  width: 100%;
  ${commonEllipsisStyles};
`;
