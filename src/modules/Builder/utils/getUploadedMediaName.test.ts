import { getUploadedMediaName } from './getUploadedMediaName';

describe('getUploadedMediaName', () => {
  test.each`
    url                                              | expected       | description
    ${'https://example.com/uploads/media/image.jpg'} | ${'image.jpg'} | ${'returns the correct media name when given a valid url with a file name'}
    ${''}                                            | ${''}          | ${'returns an empty string when given an empty string as input'}
    ${'https://example.com/uploads/media/'}          | ${''}          | ${'returns the correct media name when given a url without a file name'}
  `('$description', ({ url, expected }) => {
    expect(getUploadedMediaName(url)).toEqual(expected);
  });
});
