import { Roles } from 'shared/consts';

import {
  getCount,
  convertDateToYearMonthDay,
  getNextColor,
  getFrequencyString,
  checkIfHasAccessToSchedule,
  colorsArray,
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

  describe('convertDateToYearMonthDay', () => {
    test.each`
      date                      | expected
      ${new Date(2023, 0, 1)}   | ${'2023-01-01'}
      ${new Date(2025, 11, 15)} | ${'2025-12-15'}
      ${'2023-01-01'}           | ${'2023-01-01'}
    `('date=$date, expected=$expected', ({ date, expected }) => {
      expect(convertDateToYearMonthDay(date)).toEqual(expected);
    });
  });

  describe('getNextColor', () => {
    test.each`
      index | expected
      ${0}  | ${colorsArray[0]}
      ${4}  | ${colorsArray[4]}
      ${9}  | ${colorsArray[0]}
      ${10} | ${colorsArray[1]}
      ${69} | ${colorsArray[6]}
    `('index=$index, expected=$expected', ({ index, expected }) => {
      expect(getNextColor(index)).toEqual(expected);
    });
  });

  describe('getFrequencyString', () => {
    test.each`
      string        | expected
      ${'text'}     | ${'text'}
      ${'SOMEtext'} | ${'Sometext'}
      ${'tExT'}     | ${'text'}
      ${'TExT'}     | ${'Text'}
    `('string=$string, expected=$expected', ({ string, expected }) => {
      expect(getFrequencyString(string)).toEqual(expected);
    });
  });

  describe('checkIfHasAccessToSchedule', () => {
    test.each`
      roles                                               | expected
      ${[Roles.Editor, Roles.Reviewer, Roles.Respondent]} | ${false}
      ${[Roles.Owner, Roles.Reviewer, Roles.Respondent]}  | ${true}
      ${[Roles.Editor]}                                   | ${false}
      ${[Roles.Reviewer]}                                 | ${false}
      ${[Roles.Respondent]}                               | ${false}
      ${[Roles.Owner]}                                    | ${true}
      ${[Roles.Manager]}                                  | ${true}
      ${[Roles.SuperAdmin]}                               | ${true}
      ${[Roles.Coordinator]}                              | ${true}
    `('roles=$roles, expected=$expected', ({ roles, expected }) => {
      expect(checkIfHasAccessToSchedule(roles)).toBe(expected);
    });
  });
});
