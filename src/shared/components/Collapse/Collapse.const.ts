import { CollapseTypes } from './Collapse.types';
import { StyledCollapseContainer, StyledCollapseSwitchContainer } from './Collapse.styles';

export const COLLAPSE_COMPONENT_BY_UI_TYPE = {
  [CollapseTypes.Default]: StyledCollapseContainer,
  [CollapseTypes.Switch]: StyledCollapseSwitchContainer,
};
