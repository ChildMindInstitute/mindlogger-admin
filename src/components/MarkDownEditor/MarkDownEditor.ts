import MdEditor from 'md-editor-rt';
import i18n from 'i18n';

export const LANGUAGE_BY_DEFAULT = 'en';
export const THRESHOLD_SIZE = 75;

const { t } = i18n;
MdEditor.config({
  editorConfig: {
    languageUserDefined: {
      [LANGUAGE_BY_DEFAULT]: {
        toolbarTips: {
          bold: t('bold'),
          underline: t('underline'),
          italic: t('italic'),
          strikeThrough: t('strikeThrough'),
          title: t('title'),
          sub: t('subscript'),
          sup: t('superscript'),
          quote: t('quote'),
          unorderedList: t('unorderedList'),
          orderedList: t('orderedList'),
          code: t('mdEditorBlockLevelCode'),
          codeRow: t('inlineCode'),
          link: t('link'),
          image: t('image'),
          table: t('table'),
          revoke: t('undo'),
          next: t('redo'),
          pageFullscreen: t('fullscreenMode'),
          preview: t('preview'),
          htmlPreview: t('htmlPreview'),
          catalog: t('navigation'),
        },
        titleItem: {
          h1: t('lv1Heading'),
          h2: t('lv2Heading'),
          h3: t('lv3Heading'),
          h4: t('lv4Heading'),
          h5: t('lv5Heading'),
          h6: t('lv6Heading'),
        },
      },
    },
  },
});
