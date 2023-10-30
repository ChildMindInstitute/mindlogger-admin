import { ItemResponseType } from 'shared/consts';

import { getDateISO, getSliderOptions, isAnswerTypeCorrect, isValueDefined } from './Report.utils';

describe('isValueDefined', () => {
  test.each`
    value                   | expectedOutput | description
    ${'Hello'}              | ${true}        | ${'should return true for a defined string value'}
    ${42}                   | ${true}        | ${'should return true for a defined number value'}
    ${['Value1', 'Value2']} | ${true}        | ${'should return true for an array of defined string values'}
    ${[1, 2, 3]}            | ${true}        | ${'should return true for an array of defined number values'}
    ${''}                   | ${true}        | ${'should return true for an empty string'}
    ${[]}                   | ${true}        | ${'should return true for an empty array'}
    ${0}                    | ${true}        | ${'should return true for zero'}
    ${null}                 | ${false}       | ${'should return false for null'}
    ${undefined}            | ${false}       | ${'should return false for undefined'}
  `('$description', ({ value, expectedOutput }) => {
    const result = isValueDefined(value);
    expect(result).toBe(expectedOutput);
  });
});

describe('isAnswerTypeCorrect', () => {
  test.each`
    answer                  | responseType                          | expectedOutput | description
    ${{ value: 3 }}         | ${ItemResponseType.SingleSelection}   | ${true}        | ${'should return true for a correct single selection/slider answer'}
    ${{ value: 'string' }}  | ${ItemResponseType.SingleSelection}   | ${false}       | ${'should return false for an incorrect single selection/slider answer'}
    ${{ value: [1, 2, 3] }} | ${ItemResponseType.MultipleSelection} | ${true}        | ${'should return true for a correct multiple selection answer'}
    ${{ value: 'string' }}  | ${ItemResponseType.MultipleSelection} | ${false}       | ${'should return false for an incorrect multiple selection answer'}
    ${'string'}             | ${ItemResponseType.Text}              | ${true}        | ${'should return true for a correct text answer'}
    ${{ value: 'string' }}  | ${ItemResponseType.Text}              | ${false}       | ${'should return false for an incorrect text answer'}
  `('$description', ({ answer, responseType, expectedOutput }) => {
    const result = isAnswerTypeCorrect(answer, responseType);
    expect(result).toBe(expectedOutput);
  });
});

describe('getDateISO', () => {
  test.each`
    date                                | time       | expectedOutput           | description
    ${new Date('2023-10-19T12:30:00Z')} | ${'15:45'} | ${'2023-10-19T15:45:00'} | ${'should format a date and time to ISO string'}
    ${new Date('2023-10-19T12:35:00Z')} | ${'5:5'}   | ${'2023-10-19T05:05:00'} | ${'should handle a date and time with single-digit hours and minutes'}
  `('$description', ({ date, time, expectedOutput }) => {
    const result = getDateISO(date, time);
    expect(result).toBe(expectedOutput);
  });
});

const expectedOptions1 = [
  { id: 'slider1-0', text: 0, value: 0 },
  { id: 'slider1-1', text: 1, value: 1 },
  { id: 'slider1-2', text: 2, value: 2 },
  { id: 'slider1-3', text: 3, value: 3 },
];
const expectedOptions2 = [{ id: 'slider2-1', text: 1, value: 1 }];

describe('getSliderOptions', () => {
  test.each`
    minValue | maxValue | itemId       | expectedOptions     | description
    ${0}     | ${3}     | ${'slider1'} | ${expectedOptions1} | ${'should create slider options [0, 3]'}
    ${1}     | ${1}     | ${'slider2'} | ${expectedOptions2} | ${'should create slider options for a single value'}
  `('$description', ({ minValue, maxValue, itemId, expectedOptions }) => {
    const result = getSliderOptions({ minValue, maxValue }, itemId);
    expect(result).toEqual(expectedOptions);
  });
});
