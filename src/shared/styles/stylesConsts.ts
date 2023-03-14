import { variables } from './variables';
import theme from './theme';

export const commonStickyStyles = `
  position: sticky;
  width: 100%;
  top: 0;
  background-color: ${variables.palette.surface};
  z-index: ${theme.zIndex.fab};
  transition: ${variables.transitions.boxShadow};
`;
