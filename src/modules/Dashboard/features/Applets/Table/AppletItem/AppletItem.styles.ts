import { Box, styled, TableRow } from '@mui/material';

import theme from 'shared/styles/theme';
import { Applet } from 'api';
import { variables } from 'shared/styles';

export const StyledAppletName = styled(Box)`
  display: flex;
  align-items: center;
  margin-left: ${({ applet }: { applet: Applet }) => (applet?.parentId ? '4.4rem' : 0)};
`;

export const StyledPinContainer = styled(Box)`
  margin-right: ${theme.spacing(1.6)};
`;

export const StyledTableRow = styled(TableRow)`
  &:hover > td {
    background-color: ${variables.palette.on_surface_alfa8};
  }
`;
