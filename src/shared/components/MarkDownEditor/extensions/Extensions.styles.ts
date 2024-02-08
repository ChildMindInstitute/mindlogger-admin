import { styled, MenuItem, MenuList } from '@mui/material';

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
  font-size: ${variables.font.size.sm};
  padding: ${theme.spacing(0.4, 1)};
  line-height: ${variables.font.lineHeight.sm};
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
