import { getRespondentName } from './getRespondentName';

describe('getRespondentName', () => {
  test.each`
    secretId      | nickname      | variant      | expected                 | description
    ${'secretId'} | ${null}       | ${'default'} | ${'secretId'}            | ${'using default variant should return the secretId when nickname is not provided'}
    ${'secretId'} | ${'nickname'} | ${'default'} | ${'secretId (nickname)'} | ${'using default variant should return the secretId with nickname in parentheses when nickname is provided'}
    ${''}         | ${''}         | ${'default'} | ${''}                    | ${'using default variant should return an empty string when secretId and nickname are empty strings'}
    ${''}         | ${'nickname'} | ${'default'} | ${'(nickname)'}          | ${'using default variant should return the nickname in parentheses when nickname is provided without secretId'}
    ${'secretId'} | ${null}       | ${'comma'}   | ${'secretId'}            | ${'using comma variant should return the secretId when nickname is not provided'}
    ${'secretId'} | ${'nickname'} | ${'comma'}   | ${'secretId, nickname'}  | ${'using comma variant should return the secretId with nickname in parentheses when nickname is provided'}
    ${''}         | ${''}         | ${'comma'}   | ${''}                    | ${'using comma variant should return an empty string when secretId and nickname are empty strings'}
    ${''}         | ${'nickname'} | ${'comma'}   | ${'nickname'}            | ${'using comma variant should return the nickname in parentheses when nickname is provided without secretId'}
  `('$description', ({ secretId, nickname, variant, expected }) => {
    expect(getRespondentName(secretId, nickname, variant)).toEqual(expected);
  });
});
