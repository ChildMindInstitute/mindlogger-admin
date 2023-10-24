import { ItemResponseType } from 'shared/consts';

import { getDefaultValue } from './Feedback.utils';

describe('getDefaultValue', () => {
  test.each`
    responseType                          | expected | description
    ${ItemResponseType.SingleSelection}   | ${null}  | ${'should return null for ItemResponseType.SingleSelection'}
    ${ItemResponseType.MultipleSelection} | ${[]}    | ${'should return an empty array for ItemResponseType.MultipleSelection'}
    ${ItemResponseType.Slider}            | ${null}  | ${'should return null for ItemResponseType.Slider'}
    ${ItemResponseType.Text}              | ${''}    | ${'should return an empty string for other response types'}
  `('$description', ({ responseType, expected }) => {
    const result = getDefaultValue(responseType);
    expect(result).toEqual(expected);
  });
});
