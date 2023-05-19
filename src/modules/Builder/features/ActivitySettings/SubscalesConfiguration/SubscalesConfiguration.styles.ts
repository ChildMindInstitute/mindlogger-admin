import { styled } from '@mui/material';

import { StyledClearedButton, theme, variables } from 'shared/styles';
import { Svg } from 'shared/components';
import { shouldForwardProp } from 'shared/utils';

export const StyledSvgButton = styled(StyledClearedButton)`
  position: absolute;
  right: ${theme.spacing(2)};
`;

export const StyledSvg = styled(Svg, shouldForwardProp)`
  ${({ isFilled }: { isFilled: boolean }) => `
			&& {
				fill: ${isFilled ? variables.palette.primary : variables.palette.on_surface_variant};
			}
  `}
`;
