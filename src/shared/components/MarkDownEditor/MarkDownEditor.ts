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
          code: t('inlineCode'),
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
        linkModalTips: {
          linkTitle: t('addLink'),
          descLabel: t('linkText'),
          descLabelPlaceHolder: t('textPlaceholder'),
          urlLabel: t('linkUrl'),
          urlLabelPlaceHolder: t('urlPlaceholder'),
          buttonOK: t('ok'),
        },
      },
    },
  },
  markedRenderer(renderer) {
    renderer.link = (href, title, text) =>
      `<a href="${href}" title="${title}" target="_blank">${text}</a>`;

    return renderer;
  },
  markedExtensions: [
    {
      name: 'mark',
      level: 'inline',
      start(src) {
        return src.match(/==/)?.index;
      },
      tokenizer(src) {
        const rule = /^==([^=]+(?<!=)=?(?!=)[^=]+)==|^==([^=]*)==/;
        const match = rule.exec(src);
        if (match) {
          const token = {
            type: 'mark',
            raw: match[0],
            text: (match[1] ?? match[2]).trim(),
            tokens: [],
          };
          this.lexer.inline(token.text, token.tokens);

          return token;
        }
      },
      renderer(token) {
        return `<mark>${this.parser.parseInline(token.tokens ?? [])}</mark>`;
      },
    },
    {
      name: 'underline',
      level: 'inline',
      start(src) {
        return src.match(/\+\+/)?.index;
      },
      tokenizer(src) {
        const rule = /^\+\+([^+]+(?<!\+)=?(?!\+)[^+]+)\+\+|^\+\+([^+]*)\+\+/;
        const match = rule.exec(src);
        if (match) {
          const token = {
            type: 'underline',
            raw: match[0],
            text: (match[1] ?? match[2]).trim(),
            tokens: [],
          };
          this.lexer.inline(token.text, token.tokens);

          return token;
        }
      },
      renderer(token) {
        return `<ins>${this.parser.parseInline(token.tokens ?? [])}</ins>`;
      },
    },
    {
      name: 'superscript',
      level: 'inline',
      start(src) {
        return src.match(/\^/)?.index;
      },
      tokenizer(src) {
        const rule = /^\^([^^]+)\^/;
        const match = rule.exec(src);
        if (match) {
          const token = {
            type: 'superscript',
            raw: match[0],
            text: match[1].trim(),
            tokens: [],
          };
          this.lexer.inline(token.text, token.tokens);

          return token;
        }
      },
      renderer(token) {
        return `<sup>${this.parser.parseInline(token.tokens ?? [])}</sup>`;
      },
    },
    {
      name: 'subscript',
      level: 'inline',
      start(src) {
        return src.match(/\^/)?.index;
      },
      tokenizer(src) {
        const rule = /^~([^~]+)~/;
        const match = rule.exec(src);
        if (match) {
          const token = {
            type: 'subscript',
            raw: match[0],
            text: match[1].trim(),
            tokens: [],
          };
          this.lexer.inline(token.text, token.tokens);

          return token;
        }
      },
      renderer(token) {
        return `<sub>${this.parser.parseInline(token.tokens ?? [])}</sub>`;
      },
    },
  ],
});
