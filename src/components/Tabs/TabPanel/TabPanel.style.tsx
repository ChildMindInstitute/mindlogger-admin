import { styled } from '@mui/system';
import { Box } from '@mui/material';

import { variables } from 'styles/variables';
import theme from 'styles/theme';
import { shouldForwardProp } from 'utils/shouldForwardProp';

export const StyledPanel = styled(Box, shouldForwardProp)`
  ${({ hideHeader, isMinHeightAuto }: { hideHeader: boolean; isMinHeightAuto?: boolean }) =>
    !hideHeader &&
    `
    padding: ${theme.spacing(2.4, 2.4, 1.6)};
    border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  `}
  display: ${({ hidden }) => (hidden ? 'none' : 'flex')};
  flex-direction: column;
  flex-grow: 1;
  min-height: ${({ isMinHeightAuto }) => (isMinHeightAuto ? 'auto' : 0)};
`;
