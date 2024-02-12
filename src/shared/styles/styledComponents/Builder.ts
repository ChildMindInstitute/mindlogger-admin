import { Box, styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { Svg } from 'shared/components/Svg';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

const maxWidthBuilderPadding = 'calc((100% - 123.2rem) / 2)';

export const StyledBuilderWrapper = styled(Box, shouldForwardProp)`
  overflow-y: auto;
  margin: ${theme.spacing(-2.4, -2.4, 0)};

  ${({ hasMaxWidth }: { hasMaxWidth?: boolean }) =>
    hasMaxWidth &&
    `
    > .MuiBox-root {
      ${theme.breakpoints.up('xl')} {
        padding-left: ${maxWidthBuilderPadding};
        padding-right: ${maxWidthBuilderPadding};
      }
    }
  `}
`;

export const StyledTooltipSvg = styled(Svg)`
  && {
    fill: ${variables.palette.outline};
  }

  margin-left: ${theme.spacing(0.6)};
`;
