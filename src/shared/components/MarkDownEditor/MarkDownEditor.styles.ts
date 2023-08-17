import MdEditor from 'md-editor-rt';
import { styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const MarkDownEditor = styled(MdEditor)`
  &.md-editor-fullscreen {
    z-index: ${theme.zIndex.fab};
  }

  .md-editor-preview-wrapper {
    h1 {
      font-size: ${variables.font.size.xxl};
    }
    h2 {
      font-size: ${variables.font.size.lrg};
    }
  }
`;
