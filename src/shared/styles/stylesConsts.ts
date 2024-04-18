import { variables } from './variables';
import theme from './theme';

export const commonStickyStyles = `
  position: sticky;
  width: 100%;
  top: 0;
  background-color: ${variables.palette.surface};
  z-index: ${theme.zIndex.appBar};
  transition: ${variables.transitions.all};
`;

export const commonEllipsisStyles = `
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
