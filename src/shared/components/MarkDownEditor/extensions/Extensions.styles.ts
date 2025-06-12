import { MenuItem, MenuList, styled } from '@mui/material';

import { StyledFlexAllCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledMenuList = styled(MenuList)`
  margin: 0;
  padding: 0;
  border-radius: ${variables.borderRadius.xs};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
`;

export const StyledMenuItem = styled(MenuItem)`
  font-size: ${variables.font.size.body4};
  line-height: ${variables.font.lineHeight.body4};
  padding: ${theme.spacing(0.4, 1)};
`;

export const StyledIconCenter = styled(StyledFlexAllCenter)`
  transform: translate(20%, 20%);
`;

export const StyledOrderedListIcon = styled(StyledFlexAllCenter)`
  transform: translate(10%, 10%);
`;

export const StyledUnorderedListIcon = styled(StyledFlexAllCenter)`
  transform: translate(-10%, -10%);
`;
