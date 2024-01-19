import { StabilityTrackerPhaseType } from 'shared/types';

import { getAnswerValue } from './getAnswerValue';

describe('getAnswerValue', () => {
  const answerWithPhase = {
    phaseType: StabilityTrackerPhaseType.Focus,
  };
  test.each`
    answer                    | expected           | description
    ${{ value: 0 }}           | ${'0'}             | ${'returns "0" when value is 0'}
    ${{ value: [] }}          | ${'null'}          | ${'returns "null" when value is an empty array'}
    ${null}                   | ${'null'}          | ${'returns "null" when value is null'}
    ${undefined}              | ${'null'}          | ${'returns "null" when value is undefined'}
    ${answerWithPhase}        | ${answerWithPhase} | ${'returns the same object when phaseType is present'}
    ${{ value: 'someValue' }} | ${'someValue'}     | ${'returns the value property when value is an object'}
    ${'someValue'}            | ${'someValue'}     | ${'returns the value itself when value is not an object'}
    ${0}                      | ${'0'}             | ${'returns the value itself when value is not an object and is a falsy value'}
  `('$description', ({ answer, expected }) => {
    expect(getAnswerValue(answer)).toEqual(expected);
  });
});
