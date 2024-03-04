import { getNewValue } from './LiveResponseStreamingSetting.utils';
import { portFieldName } from './LiveResponseStreamingSetting.const';

describe('getNewValue', () => {
  test.each([
    ['', 'someField', null],
    [null, 'someField', null],
    ['', portFieldName, null],
    [null, portFieldName, null],
    ['someValue', 'someField', 'someValue'],
    ['123', portFieldName, 123],
    ['abc', portFieldName, 'abc'],
  ])('returns %s when value is %s and fieldName is %s', (value, fieldName, expected) => {
    expect(getNewValue({ value, fieldName })).toBe(expected);
  });
});
