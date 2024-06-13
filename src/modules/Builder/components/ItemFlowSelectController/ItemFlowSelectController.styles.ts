import { styled } from '@mui/material';
import { MdPreview } from 'md-editor-rt';

import { SelectController } from 'shared/components/FormComponents';
import { theme, variables } from 'shared/styles';

export const StyledSelectController = styled(SelectController)({
  minWidth: theme.spacing(10),
  width: '100%',

  '&& .MuiInputBase-root': {
    borderRadius: variables.borderRadius.md,

    '&.Mui-error': {
      background: variables.palette.error_container,
    },

    '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      borderColor: variables.palette.outline,
    },
  },

  '&& .MuiSelect-select': {
    padding: theme.spacing(0.65, 1.2),
  },

  '&& .MuiFormHelperText-root': {
    display: 'none',
  },

  '&& .MuiSvgIcon-root.Mui-disabled': {
    display: 'none',
  },

  '&& .MuiOutlinedInput-notchedOutline': {
    borderColor: variables.palette.outline,
  },
});

export const StyledMdPreview = styled(MdPreview)({
  '--md-bk-color': 'inherit',
  '--md-bk-color-outstand': 'inherit',
  '--md-bk-hover-color': 'inherit',
  '--md-border-active-color': 'inherit',
  '--md-border-color': 'inherit',
  '--md-border-hover-color': 'inherit',
  '--md-color': 'inherit',
  '--md-hover-color': 'inherit',
  '--md-modal-mask': 'inherit',
  '--md-scrollbar-bg-color': 'inherit',
  '--md-scrollbar-thumb-active-color': 'inherit',
  '--md-scrollbar-thumb-color': 'inherit',
  '--md-scrollbar-thumb-hover-color': 'inherit',
  '--md-theme-bg-color': 'inherit',
  '--md-theme-bg-color-inset': 'inherit',
  '--md-theme-bg-color-scrollbar-thumb': 'inherit',
  '--md-theme-bg-color-scrollbar-thumb-active': 'inherit',
  '--md-theme-bg-color-scrollbar-thumb-hover': 'inherit',
  '--md-theme-bg-color-scrollbar-track': 'inherit',
  '--md-theme-border-color': 'inherit',
  '--md-theme-border-color-inset': 'inherit',
  '--md-theme-border-color-reverse': 'inherit',
  '--md-theme-code-active-color': 'inherit',
  '--md-theme-code-copy-tips-bg-color': 'inherit',
  '--md-theme-code-copy-tips-color': 'inherit',
  '--md-theme-color': 'inherit',
  '--md-theme-color-hover': 'inherit',
  '--md-theme-color-hover-inset': 'inherit',
  '--md-theme-color-reverse': 'inherit',
  '--md-theme-link-color': 'inherit',
  '--md-theme-link-hover-color': 'inherit',
  fontFamily: 'inherit',

  '& .md-editor-preview-wrapper': { padding: 0 },

  '& .md-editor-preview': {
    '--md-theme-bg-color': 'inherit',
    '--md-theme-bg-color-inset': 'inherit',
    '--md-theme-bg-color-scrollbar-thumb': 'inherit',
    '--md-theme-bg-color-scrollbar-thumb-active': 'inherit',
    '--md-theme-bg-color-scrollbar-thumb-hover': 'inherit',
    '--md-theme-bg-color-scrollbar-track': 'inherit',
    '--md-theme-border-color': 'inherit',
    '--md-theme-border-color-inset': 'inherit',
    '--md-theme-border-color-reverse': 'inherit',
    '--md-theme-code-active-color': 'inherit',
    '--md-theme-code-copy-tips-bg-color': 'inherit',
    '--md-theme-code-copy-tips-color': 'inherit',
    '--md-theme-color': 'inherit',
    '--md-theme-color-hover': 'inherit',
    '--md-theme-color-hover-inset': 'inherit',
    '--md-theme-color-reverse': 'inherit',
    '--md-theme-link-color': 'inherit',
    '--md-theme-link-hover-color': 'inherit',
    fontSize: theme.spacing(1.4),
  },

  '& p': {
    lineHeight: 'inherit',
    margin: 0,
    padding: 0,
  },

  '& h1, & h2, & h3, & h4, & h5, & h6': {
    margin: '0.5rem 0',
  },

  '& h1': { fontSize: theme.spacing(2.2) },
  '& h2': { fontSize: theme.spacing(2) },
  '& h3': { fontSize: theme.spacing(1.8) },
  '& h4': { fontSize: theme.spacing(1.6) },
  '& h5': { fontSize: theme.spacing(1.4) },
  '& h6': { fontSize: theme.spacing(1.4) },

  '& ol, & ul': {
    margin: 0,

    '& li': { margin: 0 },
  },

  '& table': {
    margin: 0,

    '& tr th, & tr td': {
      padding: theme.spacing(0.4),
    },
  },

  '& audio': { maxWidth: '100%' },
  '& video': { maxWidth: '100%' },
  '&& code, && .code-block': { padding: theme.spacing(0.8) },
  '&& .code-block': { padding: 0 },

  '&& pre': {
    margin: theme.spacing(0.8, 0),

    '&:before, & code[language]:before': { content: 'none' },
    '& .copy-button': { display: 'none' },
  },
});

StyledMdPreview.defaultProps = {
  noHighlight: true,
  noImgZoomIn: true,
};
