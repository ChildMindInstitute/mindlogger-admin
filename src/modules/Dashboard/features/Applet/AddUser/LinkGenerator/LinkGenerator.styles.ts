import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { Svg } from 'shared/components';
import { variables } from 'shared/styles';

import theme from 'shared/styles/theme';

export const StyledWrapper = styled(Box)`
  margin-bottom: ${theme.spacing(1.8)};
`;

export const StyledSvg = styled(Svg)`
  fill: ${variables.palette.outline};
  margin-left: ${theme.spacing(1)};
`;
