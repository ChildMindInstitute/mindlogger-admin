import { styled, Box } from '@mui/material';

import { variables } from 'shared/styles/variables';
import theme from 'shared/styles/theme';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledPanel = styled(Box, shouldForwardProp)`
  ${({ hiddenHeader }: { hiddenHeader: boolean; isMinHeightAuto?: boolean }) =>
    !hiddenHeader &&
    `
    padding: ${theme.spacing(2.4, 2.4, 1.6)};
    border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  `}
  display: ${({ hidden }) => (hidden ? 'none' : 'flex')};
  flex-direction: column;
  flex-grow: 1;
  min-height: ${({ isMinHeightAuto }) => (isMinHeightAuto ? 'auto' : 0)};
`;
