import { Box, styled } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { theme, variables } from 'shared/styles';

export const StyledWrapper = styled(Box)`
  width: 55rem;
`;

export const StyledSvg = styled(Svg)`
  position: absolute;
  margin-left: ${theme.spacing(1)};
  fill: ${variables.palette.outline};
`;
