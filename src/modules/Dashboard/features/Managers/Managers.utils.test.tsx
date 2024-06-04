import { Svg } from 'shared/components';
import { mockedManager, mockedAppletId } from 'shared/mock';
import { variables } from 'shared/styles';

import { getManagerActions, getHeadCells } from './Managers.utils';

const headCellProperties = ['avatar', 'firstName', 'lastName', 'title', 'email', 'actions'];
const removeAccessAction = jest.fn();
const editAccessAction = jest.fn();

describe('Managers utils tests', () => {
  describe('getHeadCells function', () => {
    test('returns the correct array of head cells without an id', () => {
      const headCells = getHeadCells();
      expect(headCells).toHaveLength(6);
      headCellProperties.forEach((property, index) => {
        expect(headCells[index]).toHaveProperty('id', property);
      });
    });

    test('returns the correct array of head cells with an id', () => {
      const headCells = getHeadCells(undefined, mockedAppletId);
      expect(headCells).toHaveLength(7);
      expect(headCells[4]).toHaveProperty('id', 'roles');
    });
  });

  describe('getManagerActions function', () => {
    test('should return the correct actions for a manager', () => {
      const actions = getManagerActions({ removeAccessAction, editAccessAction }, mockedManager);

      expect(actions).toEqual([
        {
          icon: <Svg id="edit-user" />,
          action: editAccessAction,
          title: 'Edit Access',
          context: mockedManager,
          'data-testid': 'dashboard-managers-edit-user',
        },
        {
          icon: <Svg id="remove-access" />,
          action: removeAccessAction,
          title: 'Remove Access',
          context: mockedManager,
          customItemColor: variables.palette.dark_error_container,
          'data-testid': 'dashboard-managers-remove-access',
        },
      ]);
    });
  });
});
