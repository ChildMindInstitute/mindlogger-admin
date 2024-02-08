import abbr from 'markdown-it-abbr';
import container from 'markdown-it-container';
import deflist from 'markdown-it-deflist';
import emoji from 'markdown-it-emoji';
import footnote from 'markdown-it-footnote';
import html5Embed from 'markdown-it-html5-embed';
import miip from 'markdown-it-images-preview';
import markdownItImSize from 'markdown-it-imsize';
import insert from 'markdown-it-ins';
import katex from 'markdown-it-katex-external';
import mark from 'markdown-it-mark';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import taskLists from 'markdown-it-task-lists';
import { config } from 'md-editor-rt';

import i18n from 'i18n';

import { LANGUAGE_BY_DEFAULT, VIDEO_LINK_REGEX } from './MarkDownEditor.const';

const { t } = i18n;

config({
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
  markdownItConfig(mdit) {
    mdit
      .set({
        html: true, // Enable HTML tags in source
        xhtmlOut: true, // Use '/' to close single tags (<br />).
        breaks: true, // Convert '\n' in paragraphs into <br>
        langPrefix: 'lang-', // CSS language prefix for fenced blocks.
        linkify: false,
        typographer: true,
        quotes: '“”‘’',
      })
      .use(emoji)
      .use(taskLists)
      .use(sup)
      .use(sub)
      .use(container)
      .use(container, 'hljs-left') /* align left */
      .use(container, 'hljs-center') /* align center */
      .use(container, 'hljs-right') /* align right */
      .use(deflist)
      .use(abbr)
      .use(footnote)
      .use(insert)
      .use(mark)
      .use(container)
      .use(miip)
      .use(katex)
      .use(html5Embed, {
        html5embed: {
          useImageSyntax: true,
        },
      })
      .use(markdownItImSize)
      .use(md => {
        const defaultRender = md.renderer.rules.image;
        if (!defaultRender) return;

        md.renderer.rules.image = function (tokens, idx, options, env, self) {
          const token = tokens[idx];
          const src = token.attrGet('src');
          const description = token.children?.[0]?.content;

          if (src && VIDEO_LINK_REGEX.test(src)) {
            return `<a target="_blank" href="${src}">
                      ${description || src}
                    </a>`;
          }

          return defaultRender(tokens, idx, options, env, self);
        };
      });
  },
});
