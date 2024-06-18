import { MenuItemType, Svg } from 'shared/components';
import {
  mockedManager,
  mockedAppletId,
  mockedManagerId,
  mockedEmail,
  mockedEncryption,
} from 'shared/mock';
import { variables } from 'shared/styles';

import { getManagerActions, getHeadCells } from './Managers.utils';
import { Manager } from '../../types';
import { Roles } from '../../../../shared/consts';

const headCellProperties = ['avatar', 'firstName', 'lastName', 'title', 'email', 'actions'];
const removeAccessAction = jest.fn();
const editAccessAction = jest.fn();
const copyEmailAddressAction = jest.fn();
const copyInvitationLinkAction = jest.fn();

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
    test('should return the correct actions for an approved manager', () => {
      const actions = getManagerActions(
        { removeAccessAction, editAccessAction, copyEmailAddressAction, copyInvitationLinkAction },
        mockedManager,
      );

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

    test('should return the correct actions for a pending manager', () => {
      const pendingManager: Manager = {
        id: mockedManagerId,
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        title: 'PhD',
        email: mockedEmail,
        roles: [Roles.Manager],
        lastSeen: '2023-08-15T13:39:24.058402',
        isPinned: false,
        applets: [
          {
            id: mockedAppletId,
            displayName: 'displayName',
            image: '',
            roles: [
              {
                accessId: '17ba7d95-f766-42ae-9ce6-2f8fcc3l24a',
                role: Roles.Manager,
              },
            ],
            encryption: mockedEncryption,
          },
        ],
        createdAt: '2021-10-01T00:00:00.000Z',
        titles: [],
        status: 'pending',
        invitationKey: 'df3c8ab9-78fc-4dd1-8eba-63bef39e5805',
      };
      const actions = getManagerActions(
        { removeAccessAction, editAccessAction, copyEmailAddressAction, copyInvitationLinkAction },
        pendingManager,
      );

      expect(actions).toEqual([
        {
          type: MenuItemType.Info,
          title: 'Invitation Date: Oct 01, 2021 at 00:00',
        },
        { type: MenuItemType.Divider },
        {
          icon: <Svg id="duplicate" width={24} height={24} />,
          action: expect.any(Function),
          title: 'Copy Email Address',
          context: pendingManager,
        },
        { type: MenuItemType.Divider },
        {
          icon: <Svg id="format-link" width={24} height={24} />,
          action: expect.any(Function),
          title: 'Copy Invitation Link',
          context: pendingManager,
        },
        { type: MenuItemType.Divider },
        {
          icon: <Svg id="edit-user" />,
          action: editAccessAction,
          title: 'Edit Access',
          context: pendingManager,
          'data-testid': 'dashboard-managers-edit-user',
        },
        {
          icon: <Svg id="remove-access" />,
          action: removeAccessAction,
          title: 'Remove Access',
          context: pendingManager,
          customItemColor: variables.palette.dark_error_container,
          'data-testid': 'dashboard-managers-remove-access',
        },
      ]);
    });
  });
});
