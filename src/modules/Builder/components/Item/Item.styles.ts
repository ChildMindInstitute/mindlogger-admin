import { styled } from '@mui/system';
import { Box } from '@mui/material';

import { StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

import { ItemUiType } from './Item.types';

export const StyledItem = styled(StyledFlexTopCenter, shouldForwardProp)`
  ${({ uiType, onClick }: { uiType: ItemUiType; onClick?: () => void }) => `
    margin-bottom: ${theme.spacing(1.6)};
    padding: ${theme.spacing(1.3, 2.4)};
    width: 100%;
    border-radius: ${variables.borderRadius.lg2};
    height: ${uiType === ItemUiType.Activity ? '9.8rem' : '7.2rem'};
    transition: ${variables.transitions.all};
    cursor: ${onClick ? 'pointer' : 'default'};
  
    .item-name {
      transition: ${variables.transitions.fontWeight};
    }
  
    &:hover {
      box-shadow: ${uiType === ItemUiType.Activity ? variables.boxShadow.dark5 : 'inherit'}; 
      background-color: ${
        uiType === ItemUiType.Flow ? variables.palette.surface_variant_alfa8 : 'inherit'
      };
      
      .item-name {
        font-weight: ${uiType === ItemUiType.Flow ? variables.font.weight.bold : 'inherit'};
      } 
    }
  `}
`;

export const StyledCol = styled(Box)`
  flex-grow: 1;
  padding-right: ${theme.spacing(1)};
`;

export const StyledActions = styled(Box)`
  width: auto;
  height: 2.4rem;
`;

export const StyledImg = styled('img')`
  margin-right: ${theme.spacing(1.2)};
  border-radius: ${variables.borderRadius.lg};
  max-width: 7.2rem;
  height: 7.2rem;
`;
