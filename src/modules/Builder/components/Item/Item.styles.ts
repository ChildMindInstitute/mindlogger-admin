import { Box, styled } from '@mui/material';

import {
  commonEllipsisStyles,
  StyledBodyLarge,
  StyledFlexTopCenter,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

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
    if (uiType === ItemUiType.Flow && isDragging) {
      bgColor = variables.palette.surface_variant_alfa8;
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
    
      .item-name {
        transition: ${variables.transitions.fontWeight};
      }
    
      &:hover {
        box-shadow: inherit; 
        background-color: ${
          uiType === ItemUiType.Flow || uiType === ItemUiType.Activity
            ? variables.palette.surface_variant_alfa8
            : 'inherit'
        };
        
        .item-name {
          font-weight: ${uiType === ItemUiType.Flow ? variables.font.weight.bold : 'inherit'};
        } 
      }
  `;
  }}
`;

export const StyledCol = styled(Box)`
  width: calc(100% - 24rem);
  padding-right: ${theme.spacing(1)};
`;

export const StyledActions = styled(StyledFlexTopCenter)`
  flex-grow: 1;
  height: 2.4rem;
`;

export const StyledImg = styled('img')`
  margin-right: ${theme.spacing(1.2)};
  border-radius: ${variables.borderRadius.lg};
  max-width: 7.2rem;
  height: 7.2rem;
`;

export const StyledFlowDescription = styled(StyledBodyLarge)`
  width: 100%;
  ${commonEllipsisStyles};
`;

export const StyledActivityDescription = styled(StyledTitleMedium)`
  width: 100%;
  ${commonEllipsisStyles};
`;
