import { isValueDefined } from './isValueDefined';

describe('Respondent Data Summary: isValueDefined', () => {
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
