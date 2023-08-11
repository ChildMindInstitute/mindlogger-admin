import { styled, Badge } from '@mui/material';

import { shouldForwardProp } from 'shared/utils';
import { StyledFlexColumn, StyledFlexTopCenter, theme, variables } from 'shared/styles';

import { ToggleContainerUiType } from './ToggleItemContainer.types';

export const StyledItemOptionContainer = styled(StyledFlexColumn, shouldForwardProp)`
  background: ${({ uiType }: { uiType?: ToggleContainerUiType }) =>
    uiType === ToggleContainerUiType.Score
      ? variables.palette.surface3
      : variables.palette.surface1};
  padding: ${theme.spacing(3, 3, 2.1, 3)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledItemOption = styled(StyledItemOptionContainer)`
  padding: ${theme.spacing(1.6, 2.4, 1.6, 2.4)};
  position: relative;
  width: 100%;
`;

export const StylesTitleWrapper = styled(StyledFlexTopCenter, shouldForwardProp)`
  justify-content: space-between;

  ${({
    open,
    uiType,
    isError,
  }: {
    open?: boolean;
    uiType?: ToggleContainerUiType;
    isError?: boolean;
  }) => `
    height: 4.8rem;
    overflow: ${isError ? 'visible' : 'hidden'};
		margin-bottom: ${open && uiType === ToggleContainerUiType.PerformanceTask ? theme.spacing(1.5) : 0}
	`};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledBadge = styled(Badge)`
  margin-right: ${theme.spacing(1)};
  left: -0.6rem;
`;

export const StyledTitleContainer = styled(StyledFlexTopCenter, shouldForwardProp)`
  margin: ${theme.spacing(0, 5, 0, 1.5)};

  ${({ hasError }: { hasError: boolean }) =>
    hasError &&
    `
    margin-left: ${theme.spacing(2.5)};
  `}
`;
