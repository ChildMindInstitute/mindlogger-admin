import { getSanitizedContent } from './forms';

describe('forms', () => {
  describe('getSanitizedContent', () => {
    test.each([
      [false, false, `before\n<script>alert('test 3')</script>\nafter`, 'before\n\nafter'],
      [false, false, '', ''],
      [
        false,
        false,
        '[video-link](https://web.org/someContent.mp4)',
        '[video-link](https://web.org/someContent.mp4)',
      ],
      [
        false,
        false,
        '![image-link-preview](https://web.org/someContent.jpg)',
        '![image-link-preview](https://web.org/someContent.jpg)',
      ],
      [
        false,
        true,
        '<a href="https://web.org/test.mp4">video-link</a>',
        '<a href="weborg/testmp4">video-link</a>',
      ],
      [true, true, '<a href="https://web.org/test.mp4">video-link</a>', 'video-link'],
      [
        true,
        false,
        '[video-link](https://web.org/someContent.mp4)',
        '[video-link](https://web.org/someContent.mp4)',
      ],
      [
        false,
        true,
        '[video-link](https://web.org/someContent.mp4)',
        '[video-link](weborg/someContentmp4)',
      ],
      [
        false,
        true,
        `<a target="_blank" href="https://www.test.org">Opens in new tab</a>`,
        '<a target="_blank" href="testorg">Opens in new tab</a>',
      ],
      [
        true,
        true,
        `<a target="_blank" href="https://www.test.org">Opens in new tab</a>`,
        'Opens in new tab',
      ],
    ])(
      'when sanitizeFromLink is "%s", sanitizeFromUrl is "%s", contene is "%s" then returns the content %s',
      (sanitizeFromLink, sanitizeFromUrl, content, expected) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result = getSanitizedContent(content, sanitizeFromLink, sanitizeFromUrl);
        expect(result).toEqual(expected);
      },
    );
  });
});
