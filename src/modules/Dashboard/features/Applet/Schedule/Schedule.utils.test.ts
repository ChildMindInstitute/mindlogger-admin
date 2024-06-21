import { format } from 'date-fns';

import { DateFormats, Roles } from 'shared/consts';

import {
  getCount,
  convertDateToYearMonthDay,
  getNextColor,
  getFrequencyString,
  checkIfHasAccessToSchedule,
  colorsArray,
  getEventStartDMYString,
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

  describe('getEventStartDMYString', () => {
    test.each([
      [true, '2023-12-21T15:12:34.842050', '21 Dec 2023'],
      [false, '2023-12-21', '21 Dec 2023'],
      [true, '2024-06-12T12:00:00Z', '12 Jun 2024'],
      [false, '2024-06-12', '12 Jun 2024'],
      [false, null, format(new Date(), DateFormats.DayMonthYear)],
      [false, undefined, format(new Date(), DateFormats.DayMonthYear)],
      [false, 'invalid-date', format(new Date(), DateFormats.DayMonthYear)],
      [true, '2023-02-30', format(new Date(), DateFormats.DayMonthYear)],
    ])(
      'returns correct formatted date for isAlwaysAvailable=%s and dateString=%s',
      (isAlwaysAvailable, dateString, expected) => {
        const result = getEventStartDMYString(isAlwaysAvailable, dateString);

        expect(result).toBe(expected);
      },
    );
  });
});
