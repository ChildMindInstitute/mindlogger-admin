import { Box, styled } from '@mui/material';
import { FolderApplet } from 'redux/modules';

export const StyledAppletName = styled(Box)`
  display: flex;
  align-items: center;
  margin-left: ${({ applet }: { applet: FolderApplet }) =>
    applet?.depth ? `${applet.depth * 4.4}rem` : 0};
`;
