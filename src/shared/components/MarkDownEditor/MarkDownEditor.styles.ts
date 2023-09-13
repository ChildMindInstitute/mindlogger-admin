import { MdEditor, MdPreview } from 'md-editor-rt';
import { styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

const commonStyles = `
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
  
  .md-editor-preview-wrapper .hljs-left {
    text-align: left;
  }

  .md-editor-preview-wrapper .hljs-center {
    text-align: center;
  }
  
  .md-editor-preview-wrapper .hljs-right {
    text-align: right;
  }

`;

export const MarkDownEditor = styled(MdEditor)`
  ${commonStyles}
`;

export const MarkDownPreview = styled(MdPreview)`
  ${commonStyles}
`;
