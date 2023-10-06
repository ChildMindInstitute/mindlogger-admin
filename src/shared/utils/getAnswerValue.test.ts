import { AnswerDTO, StabilityTrackerPhaseType } from 'shared/types';
import { getAnswerValue } from './getAnswerValue';

describe('getAnswerValue', () => {
  test('returns "0" when value is 0', () => {
    const answer: AnswerDTO = { value: 0 };
    expect(getAnswerValue(answer)).toBe('0');
  });

  test('returns "null" when value is an empty array', () => {
    const answer: AnswerDTO = { value: [] };
    expect(getAnswerValue(answer)).toBe('null');
  });

  test('returns "null" when value is null or undefined', () => {
    expect(getAnswerValue()).toBe('null');
    expect(getAnswerValue(null)).toBe('null');
  });

  test('returns the same object when phaseType is present in DecryptedStabilityTrackerAnswerObject', () => {
    const answer = {
      phaseType: StabilityTrackerPhaseType.Focus,
    } as AnswerDTO;
    expect(getAnswerValue(answer)).toEqual(answer);
  });

  test('returns the value property when value is an object', () => {
    const answer: AnswerDTO = { value: 'someValue' };
    expect(getAnswerValue(answer)).toBe('someValue');
  });

  test('returns the value itself when value is not an object', () => {
    const answer: AnswerDTO = 'someValue';
    expect(getAnswerValue(answer)).toBe(answer);
  });
  test('returns the value itself when value is not an object and is a falsy value', () => {
    const answer = 0 as AnswerDTO;
    expect(getAnswerValue(answer)).toBe('0');
  });
  test('fails when value is different', () => {
    const answerFirst: AnswerDTO = { value: 'someValue' };
    expect(getAnswerValue(answerFirst)).not.toBe('differentValue');
    const answerSecond: AnswerDTO = 'someValue';
    expect(getAnswerValue(answerSecond)).not.toBe('differentValue');
  });
});
