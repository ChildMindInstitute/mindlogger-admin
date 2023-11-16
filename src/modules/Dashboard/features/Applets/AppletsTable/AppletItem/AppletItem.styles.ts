import { Box, styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { Applet } from 'api';

export const StyledAppletName = styled(Box)`
  display: flex;
  align-items: center;
  margin-left: ${({ applet }: { applet: Applet }) => (applet?.parentId ? '4.4rem' : 0)};
`;

export const StyledPinContainer = styled(Box)`
  margin-right: ${theme.spacing(1.6)};
`;
