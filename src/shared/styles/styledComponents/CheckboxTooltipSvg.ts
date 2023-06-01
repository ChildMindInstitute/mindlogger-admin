import { styled } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { theme } from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledCheckboxTooltipSvg = styled(Svg)`
  fill: ${variables.palette.outline};
  position: absolute;
  margin-left: ${theme.spacing(1)};
`;
