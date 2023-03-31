import { styled } from '@mui/material';

import { theme, variables } from 'shared/styles';
import { Svg } from 'shared/components';

export const StyledScoreSummaryTooltipSvg = styled(Svg)`
  fill: ${variables.palette.outline};
  margin-left: ${theme.spacing(1)};
`;
