// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { findVisitErrorMessage, getHeadCells, getMatchOptions } from './Visits.utils';

describe('getHeadCells', () => {
  test('should return correct head cells', () => {
    const selectAllChecked = true;
    const onSelectAllClick = jest.fn();
    const headCells = getHeadCells(selectAllChecked, onSelectAllClick);
    expect(headCells).toEqual([
      { id: 'selected', label: expect.any(Object), enableSort: false },
      { id: 'activityName', label: 'Activity Name', enableSort: false },
      { id: 'completed', label: 'Completed', enableSort: false },
      { id: 'secretUserId', label: 'ID', enableSort: false },
      { id: 'lorisVisits', label: 'LORIS Visits', enableSort: false },
    ]);
  });
});

describe('getMatchOptions', () => {
  test('should return correct match options', () => {
    const visitsList = ['visit1', 'visit2'];
    const options = getMatchOptions({ visitsList, visits: ['visit1'] });
    expect(options).toEqual([
      { labelKey: 'visit1', value: 'visit1', disabled: true },
      { labelKey: 'visit2', value: 'visit2', disabled: false },
    ]);
  });
});

describe('findVisitErrorMessage', () => {
  test.each([
    ['should return null when there are no errors', {}, null],
    ['should return null when there are no visitForm errors', { visitsForm: [] }, null],
    [
      'should return null when there are no activities errors',
      { visitsForm: [{ activities: [] }] },
      null,
    ],
    [
      'should return null when there are no visit error messages',
      { visitsForm: [{ activities: [{ visit: {} }] }] },
      null,
    ],
    [
      'should return visit error message when it exists',
      { visitsForm: [{ activities: [{ visit: { message: 'This is an error message' } }] }] },
      'This is an error message',
    ],
    [
      'should return the first visit error message it finds',
      {
        visitsForm: [
          { activities: [{ visit: { message: 'This is an error message' } }] },
          { activities: [{ visit: { message: 'Another error message' } }] },
        ],
      },
      'This is an error message',
    ],
    [
      'should return the correct visit error message even with multiple activities',
      {
        visitsForm: [
          { activities: [{ visit: {} }, { visit: { message: 'This is an error message' } }] },
        ],
      },
      'This is an error message',
    ],
  ])('%s', (_, errors, expected) => {
    expect(findVisitErrorMessage(errors)).toBe(expected);
  });
});
