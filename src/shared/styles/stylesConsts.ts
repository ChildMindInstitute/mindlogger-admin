import theme from './theme';
import { variables } from './variables';

export const commonStickyStyles = `
  position: sticky;
  width: 100%;
  top: 0;
  background-color: ${variables.palette.surface};
  z-index: ${theme.zIndex.fab};
  transition: ${variables.transitions.all};
`;

export const commonEllipsisStyles = `
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
