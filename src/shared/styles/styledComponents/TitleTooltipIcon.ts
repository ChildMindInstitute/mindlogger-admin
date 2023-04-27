import { styled } from '@mui/material';

import { Svg } from 'shared/components/Svg';

import theme from '../theme';
import { variables } from '../variables';

export const StyledTitleTooltipIcon = styled(Svg)`
  margin-left: ${theme.spacing(1)};
  fill: ${variables.palette.outline};
`;
