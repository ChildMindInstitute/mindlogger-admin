import { Box, styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { Svg } from 'shared/components/Svg';

export const StyledBuilderWrapper = styled(Box)`
  overflow-y: auto;
  margin: ${theme.spacing(-2.4, -2.4, 0)};
`;

export const StyledTooltipSvg = styled(Svg)`
  && {
    fill: ${variables.palette.outline};
  }

  margin-left: ${theme.spacing(1)};
`;
