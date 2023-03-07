import MdEditor from 'md-editor-rt';
import i18n from 'i18n';

export const LANGUAGE_BY_DEFAULT = 'en';
export const THRESHOLD_SIZE = 75;

MdEditor.config({
  editorConfig: {
    languageUserDefined: {
      [LANGUAGE_BY_DEFAULT]: {
        toolbarTips: {
          bold: i18n.t('mdEditorBold'),
          underline: i18n.t('mdEditorUnderline'),
          italic: i18n.t('mdEditorItalic'),
          strikeThrough: i18n.t('mdEditorStrikeThrough'),
          title: i18n.t('mdEditorTitle'),
          sub: i18n.t('mdEditorSubscript'),
          sup: i18n.t('mdEditorSuperscript'),
          quote: i18n.t('mdEditorQuote'),
          unorderedList: i18n.t('mdEditorUnorderedList'),
          orderedList: i18n.t('mdEditorOrderedList'),
          code: i18n.t('mdEditorBlockLevelCode'),
          codeRow: i18n.t('mdEditorInlineCode'),
          link: i18n.t('mdEditorLink'),
          image: i18n.t('mdEditorImage'),
          table: i18n.t('mdEditorTable'),
          revoke: i18n.t('mdEditorUndo'),
          next: i18n.t('mdEditorRedo'),
          pageFullscreen: i18n.t('mdEditorFullscreenMode'),
          preview: i18n.t('mdEditorPreview'),
          htmlPreview: i18n.t('mdEditorHtmlPreview'),
          catalog: i18n.t('mdEditorNavigation'),
        },
        titleItem: {
          h1: i18n.t('mdEditorLv1Heading'),
          h2: i18n.t('mdEditorLv2Heading'),
          h3: i18n.t('mdEditorLv3Heading'),
          h4: i18n.t('mdEditorLv4Heading'),
          h5: i18n.t('mdEditorLv5Heading'),
          h6: i18n.t('mdEditorLv6Heading'),
        },
      },
    },
  },
});

export { MdEditor };
