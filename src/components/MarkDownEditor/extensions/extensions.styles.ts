import { styled } from '@mui/system';
import { MenuItem, MenuList } from '@mui/material';

export const StyledMenuList = styled(MenuList)`
  margin: 0;
  padding: 0;
  border-radius: 3px;
  border: 1px solid var(--md-border-color);
  background-color: inherit;
`;

export const StyledMenuItem = styled(MenuItem)`
  font-size: 12px;
  color: var(--md-color);
  padding: 4px 10px;
  cursor: pointer;
  line-height: 16px;
`;
