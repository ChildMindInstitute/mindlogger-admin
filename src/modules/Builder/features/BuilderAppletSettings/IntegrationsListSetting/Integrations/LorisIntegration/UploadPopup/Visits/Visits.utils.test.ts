// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { findVisitErrorMessage, getHeadCells, getMatchOptions } from './Visits.utils';

describe('getHeadCells', () => {
  test('should return correct head cells', () => {
    const selectAllChecked = true;
    const onSelectAllClick = vi.fn();
    const headCells = getHeadCells(selectAllChecked, onSelectAllClick);
    expect(headCells).toEqual([
      { id: 'selected', label: expect.any(Object), enableSort: false },
      { id: 'activityName', label: 'Activity Name', enableSort: false },
      { id: 'completedDate', label: 'Completed', enableSort: false },
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
  test('should return null if there are no errors', () => {
    const errors: FieldErrors<UploadDataForm> = {};
    const result = findVisitErrorMessage(errors);
    expect(result).toBeNull();
  });

  test('should return null if visitsForm is not present', () => {
    const errors: FieldErrors<UploadDataForm> = { someOtherField: { message: 'Error' } };
    const result = findVisitErrorMessage(errors);
    expect(result).toBeNull();
  });

  test('should return null if visitsForm is empty', () => {
    const errors: FieldErrors<UploadDataForm> = { visitsForm: [] };
    const result = findVisitErrorMessage(errors);
    expect(result).toBeNull();
  });

  test('should return the error message from the first visit with an error', () => {
    const errors: FieldErrors<UploadDataForm> = {
      visitsForm: [{ visit: { message: 'First error' } }, { visit: { message: 'Second error' } }],
    };
    const result = findVisitErrorMessage(errors);
    expect(result).toBe('First error');
  });

  test('should skip visits without errors and return the message from the first visit with an error', () => {
    const errors: FieldErrors<UploadDataForm> = {
      visitsForm: [{ visit: null }, { visit: { message: 'Error' } }],
    };
    const result = findVisitErrorMessage(errors);
    expect(result).toBe('Error');
  });

  test('should return null if no visits have errors', () => {
    const errors: FieldErrors<UploadDataForm> = {
      visitsForm: [{ visit: null }, { visit: null }],
    };
    const result = findVisitErrorMessage(errors);
    expect(result).toBeNull();
  });
});
