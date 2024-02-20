import { getMediaName } from './getMediaName';

describe('getMediaName', () => {
  test.each`
    mediaUrl                                         | expected
    ${undefined}                                     | ${''}
    ${'https://example.com/path/to/file.png'}        | ${'file.png'}
    ${'https://example.com/another/path/image.jpg'}  | ${'image.jpg'}
    ${'https://example.com/file%20with%20space.txt'} | ${'file with space.txt'}
    ${'https://example.com/%E2%82%ACuro%20sign.jpg'} | ${'€uro sign.jpg'}
    ${'filename.jpg'}                                | ${'filename.jpg'}
    ${'///'}                                         | ${''}
  `('mediaUrl=$mediaUrl, expected=$expected', ({ mediaUrl, expected }) => {
    expect(getMediaName(mediaUrl)).toBe(expected);
  });
});
