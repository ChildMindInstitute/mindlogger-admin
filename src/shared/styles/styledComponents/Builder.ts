import { Box, styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { Svg } from 'shared/components/Svg';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledBuilderWrapper = styled(Box)`
  overflow-y: auto;
  margin: ${theme.spacing(-2.4, -2.4, 0)};
`;

export const StyledTooltipSvg = styled(Svg)`
  && {
    fill: ${variables.palette.outline};
  }

  margin-left: ${theme.spacing(0.6)};
`;

export const StyledMaxWidthWrapper = styled(Box, shouldForwardProp)`
  max-width: 123.2rem;
  ${({ hasParentColumnDirection }: { hasParentColumnDirection?: boolean }) => {
    if (hasParentColumnDirection) {
      return `
        width: 100%;
        align-self: center;
      `;
    }

    return `
     margin: 0 auto;
    `;
  }}
`;
