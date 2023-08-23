import MdEditor from 'md-editor-rt';

import i18n from 'i18n';

import {
  LANGUAGE_BY_DEFAULT,
  VALID_VIDEO_FORMATS_REGEX,
  VIDEO_LINK_REGEX,
  VideoSourcePlayerLinks,
  VideoSources,
  YOUTUBE_VIDEO_ID_REGEX,
} from './MarkDownEditor.const';

const { t } = i18n;

const getVideoIframe = (videoId: string, type: VideoSources, text?: string) =>
  `${text ? `<figure><figcaption>${text}:</figcaption>` : ''}
    <div style="position: relative; padding-bottom: 56.25%; height: 0;">
      <iframe src="${
        type === VideoSources.Youtube
          ? VideoSourcePlayerLinks.Youtube
          : VideoSourcePlayerLinks.Vimeo
      }${videoId}" allowfullscreen
        style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;"></iframe>
    </div>
  `;

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
    renderer.image = (href, title, text) => {
      const videoExtensionMatch = href?.match(VALID_VIDEO_FORMATS_REGEX);
      if (videoExtensionMatch) {
        return `${
          text ? `<figure><figcaption>${text}:</figcaption>` : ''
        }<video controls width="250"><source src="${href}"></video></figure>`;
      }

      const videoMatch = href?.match(VIDEO_LINK_REGEX);
      if (videoMatch) {
        const defaultReturn = href ? `<a href="${href}" target="_blank">${text || href}</a>` : '';
        const videoSource = videoMatch[1];
        const videoUrl = videoMatch[3];
        if (!videoSource || !videoUrl) return defaultReturn;

        if (
          videoSource.includes(VideoSources.Youtube) ||
          videoSource.includes(VideoSources.Youtu)
        ) {
          const videoId = videoUrl.match(YOUTUBE_VIDEO_ID_REGEX)?.[1];

          return videoId ? getVideoIframe(videoId, VideoSources.Youtube, text) : defaultReturn;
        } else if (videoSource.includes(VideoSources.Vimeo)) {
          const videoId = videoUrl.replace(/\D/g, '');

          return videoId ? getVideoIframe(videoId, VideoSources.Vimeo, text) : defaultReturn;
        }
      }

      return `<img src="${href}" alt="${text}" title="${title}" />`;
    };
    renderer.link = (href, title, text) =>
      `<a href="${href}" title="${title ?? 'link-title'}" target="_blank">${text || href}</a>`;

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
        const rule = /^==([^=\r\n]*={0,2}=?[^=\r\n]*)==|^==([^=\r\n]*)==/;
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
        const rule = /^\+\+([^+\r\n]*\+{0,2}=?[^+\r\n]*)\+\+|^\+\+([^+\r\n]*)\+\+/;
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
    {
      name: 'align',
      level: 'inline',
      start(src) {
        return src.match(/::: hljs-[center|left|right]/)?.index;
      },
      tokenizer(src) {
        const rule =
          /^::: hljs-[center|left|right]([^=\r\n]*={0,2}=?[^=\r\n]*):::|^::: hljs-[center|left|right]([^=\r\n]*):::/;
        const match = rule.exec(src);
        if (match) {
          const alignType = src.match(/center|left|right/)?.[0] || [];
          const token = {
            type: 'align',
            raw: match[0],
            text: match[1].trim(),
            tokens: [],
            alignType,
          };
          this.lexer.inline(token.text, token.tokens);

          return token;
        }
      },
      renderer(token) {
        return `<div style="text-align: ${token.alignType}">${this.parser.parseInline(
          token.tokens ?? [],
        )}</div>`;
      },
    },
  ],
});
