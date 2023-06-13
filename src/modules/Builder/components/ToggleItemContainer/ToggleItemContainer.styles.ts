import { styled, Badge } from '@mui/material';

import { shouldForwardProp } from 'shared/utils';
import { StyledFlexColumn, StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { ToggleContainerUiType } from './ToggleItemContainer.types';

export const StyledItemOptionContainer = styled(StyledFlexColumn)`
  background: ${variables.palette.surface1};
  padding: ${theme.spacing(3, 3, 2.1, 3)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledItemOption = styled(StyledItemOptionContainer, shouldForwardProp)`
  padding: ${({ uiType }: { uiType: ToggleContainerUiType }) =>
    theme.spacing(1.6, 2.4, 1.6, uiType === ToggleContainerUiType.Item ? 3.4 : 2.4)};
  position: relative;
  width: 100%;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StylesTitleWrapper = styled(StyledFlexTopCenter, shouldForwardProp)`
  justify-content: space-between;

  ${({ open, uiType }: { open?: boolean; uiType: ToggleContainerUiType }) => `
		height: ${open ? '5.6rem' : 'inherit'}; 
		margin-bottom: ${open && uiType === ToggleContainerUiType.PerformanceTask ? theme.spacing(1.5) : 0}
	`};
`;

export const StyledBadge = styled(Badge)`
  margin-right: ${theme.spacing(1)};
  left: -0.6rem;
`;
