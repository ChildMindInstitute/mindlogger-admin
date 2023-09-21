import { Box, styled } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledItem = styled(Box, shouldForwardProp)`
  ${({ isPrimaryUiType }: { isPrimaryUiType: boolean }) =>
    isPrimaryUiType &&
    `
      padding: ${theme.spacing(3.6, 3.2)};
      border-radius: ${variables.borderRadius.lg2};
      margin-bottom: ${theme.spacing(1.6)};
      background-color: ${variables.palette.surface1};
	`};
`;

export const StyledSvg = styled(Svg, shouldForwardProp)`
  ${({ isPrimaryUiType }: { isPrimaryUiType: boolean }) => `
      margin: ${theme.spacing(0, isPrimaryUiType ? 2.2 : 0.5, 0, isPrimaryUiType ? 1 : 0)};
      fill: ${isPrimaryUiType ? variables.palette.on_surface_variant : variables.palette.outline};
	`};

  ${({ isPrimaryUiType }) =>
    !isPrimaryUiType &&
    `
        fill: ${variables.palette.outline};
	`};
`;
