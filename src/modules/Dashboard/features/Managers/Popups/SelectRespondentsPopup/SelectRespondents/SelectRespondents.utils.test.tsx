import { getHeadCells } from './SelectRespondents.utils';

describe('getHeadCells', () => {
  test('returns an array of HeadCell objects with correct properties', () => {
    const onSelectAllClick = jest.fn();
    const selectAllChecked = true;

    const headCells = getHeadCells(onSelectAllClick, selectAllChecked);

    expect(headCells).toHaveLength(3);

    expect(headCells[0]).toHaveProperty('id', 'select');
    expect(headCells[0]).toHaveProperty('label');
    expect(headCells[0]).toHaveProperty('enableSort', false);
    expect(headCells[0]).toHaveProperty('width', '48');
  });
});
