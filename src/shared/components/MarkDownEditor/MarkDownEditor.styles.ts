import MdEditor from 'md-editor-rt';
import { styled } from '@mui/material';

import { theme } from 'shared/styles';

export const MarkDownEditor = styled(MdEditor)`
  &.md-editor-fullscreen {
    z-index: ${theme.zIndex.fab};
  }
`;
