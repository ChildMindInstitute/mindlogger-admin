import { getHeadCells, getMatchOptions } from './LorisVisits.utils';

describe('getHeadCells', () => {
  test('should return correct head cells', () => {
    const headCells = getHeadCells();
    expect(headCells).toEqual([
      { id: 'activityName', label: 'Activity Name', enableSort: false },
      { id: 'completed', label: 'Completed', enableSort: false },
      { id: 'secretUserId', label: 'ID', enableSort: false },
      { id: 'lorisVisits', label: 'LORIS Visits', enableSort: false },
    ]);
  });
});

describe('getMatchOptions', () => {
  test('should return correct match options', () => {
    const visits = ['visit1', 'visit2'];
    const options = getMatchOptions(visits);
    expect(options).toEqual([
      { labelKey: 'visit1', value: 'visit1' },
      { labelKey: 'visit2', value: 'visit2' },
    ]);
  });
});
