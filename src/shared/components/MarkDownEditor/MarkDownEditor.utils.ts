import MdEditor from 'md-editor-rt';

import i18n from 'i18n';
import { VALID_VIDEO_FILE_TYPES, VALID_AUDIO_FILE_TYPES } from 'shared/consts';

import {
  ALIGN_RULE,
  LANGUAGE_BY_DEFAULT,
  VIDEO_LINK_REGEX,
  VideoSourcePlayerLinks,
  VideoSources,
  YOUTUBE_VIDEO_ID_REGEX,
} from './MarkDownEditor.const';

const { t } = i18n;

export const getValidMediaFormatsRegex = (validFileTypesArray: string[]) => {
  const validFormatsArray = validFileTypesArray.map((format) => format.slice(1));

  return new RegExp(`\\.(${validFormatsArray.join('|')})$`, 'i');
};

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
      const videoExtensionMatch = href?.match(getValidMediaFormatsRegex(VALID_VIDEO_FILE_TYPES));
      const videoLinkMatch = href?.match(VIDEO_LINK_REGEX);
      const audioExtensionMatch = href?.match(getValidMediaFormatsRegex(VALID_AUDIO_FILE_TYPES));
      if (videoExtensionMatch) {
        return `${
          text ? `<figure><figcaption>${text}:</figcaption>` : ''
        }<video controls width="250"><source src="${href}"></video></figure>`;
      }
      if (audioExtensionMatch) {
        return `${
          text ? `<figure><figcaption>${text}:</figcaption>` : ''
        }<audio controls><source src="${href}"></audio></figure>`;
      }
      if (videoLinkMatch) {
        const defaultReturn = href ? `<a href="${href}" target="_blank">${text || href}</a>` : '';
        const videoSource = videoLinkMatch[1];
        const videoUrl = videoLinkMatch[3];
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
      level: 'block',
      start(src) {
        const match = ALIGN_RULE.exec(src);

        return match ? match.index : -1;
      },
      tokenizer(src) {
        const match = ALIGN_RULE.exec(src);
        if (match) {
          const token = {
            type: 'align',
            raw: match[0],
            text: match[2].trim(),
            tokens: [],
            alignType: match[1],
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
