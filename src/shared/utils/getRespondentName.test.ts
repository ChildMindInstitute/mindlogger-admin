import { getRespondentName } from './getRespondentName';

describe('getRespondentName', () => {
  test.each`
    secretId      | nickname      | expected                 | description
    ${'secretId'} | ${null}       | ${'secretId'}            | ${'should return the secretId when nickname is not provided'}
    ${'secretId'} | ${'nickname'} | ${'secretId (nickname)'} | ${'should return the secretId with nickname in parentheses when nickname is provided'}
    ${''}         | ${''}         | ${''}                    | ${'should return an empty string when secretId and nickname are empty strings'}
    ${''}         | ${'nickname'} | ${'(nickname)'}          | ${'should return the nickname in parentheses when nickname is provided without secretId'}
  `('$description', ({ secretId, nickname, expected }) => {
    expect(getRespondentName(secretId, nickname)).toEqual(expected);
  });
});
