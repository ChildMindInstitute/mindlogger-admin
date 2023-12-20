import { Periodicity } from 'modules/Dashboard/api';
import { DateFormats, Roles } from 'shared/consts';

import {
  getCount,
  convertDateToYearMonthDay,
  getNextColor,
  getFrequencyString,
  checkIfHasAccessToSchedule,
} from './Schedule.utils';
import { ActivitiesFlowsWithColors } from './Schedule.types';

describe('Schedule.utils.tsx', () => {
  describe('getCount', () => {
    const ids: ActivitiesFlowsWithColors = [
      { id: '1', color: ['red'] },
      { id: '2', color: ['blue'] },
      {
        id: '1',
        color: ['yellow', 'red'],
      },
    ];
    test.each`
      ids    | id     | expected
      ${ids} | ${'1'} | ${2}
      ${ids} | ${'5'} | ${0}
      ${ids} | ${'2'} | ${1}
    `('id=$id, expected=$expected', ({ ids, id, expected }) => {
      expect(getCount(ids, id)).toBe(expected);
    });
  });

  // describe('convertDateToYearMonthDay', () => {
  //   test('formats date to YearMonthDay when input is Date object', () => {
  //     const date = new Date(2023, 0, 1); // 1st Jan 2023
  //     expect(convertDateToYearMonthDay(date)).toEqual('2023-01-01');
  //   });
  //
  //   test('returns input when it is string', () => {
  //     expect(convertDateToYearMonthDay('2023-01-01')).toEqual('2023-01-01');
  //   });
  // });
  //
  // describe('getNextColor', () => {
  //   test('returns the nth color of the colors array', () => {
  //     const color = getNextColor(1);
  //     // Adjust this according to your colors
  //     expect(color).toEqual(['COLOR_VALUE', 'COLOR_VALUE_ALFA30']);
  //   });
  // });
  //
  // describe('getFrequencyString', () => {
  //   test('returns the first character capitalized and the rest lowercase', () => {
  //     const frequencyString = getFrequencyString(Periodicity.YOUR_PERIODICITY);
  //     // Adjust this according to your Periodicity enum
  //     expect(frequencyString).toEqual('YourPeriodicity');
  //   });
  // });
  //
  // describe('checkIfHasAccessToSchedule', () => {
  //   test('returns true when roles does not contain [Editor, Reviewer, Respondent]', () => {
  //     const hasAccess = checkIfHasAccessToSchedule([Roles.YOUR_ROLE]);
  //     // Adjust this according to your Roles enum
  //     expect(hasAccess).toBe(true);
  //   });
  //
  //   test('returns false when roles contains at least one of [Editor, Reviewer, Respondent]', () => {
  //     const hasAccess = checkIfHasAccessToSchedule([Roles.Editor]);
  //     expect(hasAccess).toBe(false);
  //   });
  // });
});
