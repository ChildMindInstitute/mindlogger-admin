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
          bold: t('mdEditorBold'),
          underline: t('mdEditorUnderline'),
          italic: t('mdEditorItalic'),
          strikeThrough: t('mdEditorStrikeThrough'),
          title: t('mdEditorTitle'),
          sub: t('mdEditorSubscript'),
          sup: t('mdEditorSuperscript'),
          quote: t('mdEditorQuote'),
          unorderedList: t('mdEditorUnorderedList'),
          orderedList: t('mdEditorOrderedList'),
          code: t('mdEditorBlockLevelCode'),
          codeRow: t('mdEditorInlineCode'),
          link: t('mdEditorLink'),
          image: t('mdEditorImage'),
          table: t('mdEditorTable'),
          revoke: t('mdEditorUndo'),
          next: t('mdEditorRedo'),
          pageFullscreen: t('mdEditorFullscreenMode'),
          preview: t('mdEditorPreview'),
          htmlPreview: t('mdEditorHtmlPreview'),
          catalog: t('mdEditorNavigation'),
        },
        titleItem: {
          h1: t('mdEditorLv1Heading'),
          h2: t('mdEditorLv2Heading'),
          h3: t('mdEditorLv3Heading'),
          h4: t('mdEditorLv4Heading'),
          h5: t('mdEditorLv5Heading'),
          h6: t('mdEditorLv6Heading'),
        },
      },
    },
  },
});
