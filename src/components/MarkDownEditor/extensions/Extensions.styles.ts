import { styled } from '@mui/system';
import { MenuItem, MenuList } from '@mui/material';

import { variables } from 'styles/variables';
import theme from 'styles/theme';
import { StyledFlexAllCenter } from 'styles/styledComponents';

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
