import { styled, Box } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { variables, theme } from 'shared/styles';

export const StyledWrapper = styled(Box)`
  margin-bottom: ${theme.spacing(1.8)};
`;

export const StyledSvg = styled(Svg)`
  fill: ${variables.palette.outline};
  margin-left: ${theme.spacing(1)};
`;
