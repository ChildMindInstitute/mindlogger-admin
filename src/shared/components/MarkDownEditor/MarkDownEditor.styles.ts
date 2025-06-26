import { styled } from '@mui/material';
import { MdEditor, MdPreview } from 'md-editor-rt';

import { theme, variables } from 'shared/styles';

const commonStyles = `
  &.md-editor-fullscreen {
    z-index: ${theme.zIndex.modal};
  }

  .md-editor-preview-wrapper {
    h1 {
      font-size: ${variables.font.size.headline3};
    }
    h2 {
      font-size: ${variables.font.size.title2};
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
  
  .md-editor-preview-wrapper video {
    max-width: 50%;
    display: block;
  }

`;

export const MarkDownEditor = styled(MdEditor)`
  ${commonStyles}
`;

export const MarkDownPreview = styled(MdPreview)`
  ${commonStyles}
`;
