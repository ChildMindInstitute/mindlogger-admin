import { mockI18Next } from 'shared/tests';
import { mockedAppletId } from 'shared/mock';

import { getHeadCells, getInvitationsTableRows } from './InvitationsTable.utils';
import { Invitations } from '../AddUser.types';

jest.mock('react-i18next', () => mockI18Next);

jest.mock('./InvitationWithTooltip', () => ({
  InvitationWithTooltip: jest.fn(() => 'MockedInvitationWithTooltip'),
}));

const mockedHeadCells = [
  { id: 'secretUserId', label: 'ID' },
  { id: 'firstName', label: 'First Name' },
  { id: 'lastName', label: 'Last Name' },
  { id: 'role', label: 'Role' },
  { id: 'email', label: 'Email' },
  { id: 'invitationLink', label: 'Invitation Link' },
  { id: 'dateTimeInvited', label: 'Date & Time Invited' },
];

describe('InvitationsTable.utils', () => {
  describe('getHeadCells', () => {
    test('should return an array of HeadCell objects', () => {
      expect(getHeadCells()).toEqual(
        mockedHeadCells.map(({ id, label }) => ({
          id,
          label,
          enableSort: false,
        })),
      );
    });
  });

  describe('getInvitationsTableRows', () => {
    test('should return an array of rows based on the input invitations', () => {
      const invitations: Invitations = {
        result: [
          {
            appletId: mockedAppletId,
            appletName: 'Mocked Applet',
            status: 'approved',
            meta: { subject_id: '123' },
            firstName: 'John',
            lastName: 'Doe',
            role: 'respondent',
            email: 'john.doe@example.com',
            key: 'abc123',
            createdAt: '2022-01-01T12:00:00',
            secretUserId: 'secret-id',
            nickname: 'test-nickname',
            tag: null,
            title: null,
          },
        ],
        count: 1,
      };

      const result = getInvitationsTableRows({
        invitations,
        setOpenTooltipIndex: jest.fn(),
        handleTooltipClose: jest.fn(),
        openTooltipIndex: -1,
      });

      expect(result).toEqual([
        {
          secretUserId: {
            content: expect.any(Function),
            value: 'secret-id',
          },
          firstName: {
            content: expect.any(Function),
            value: 'John',
          },
          lastName: {
            content: expect.any(Function),
            value: 'Doe',
          },
          role: {
            content: expect.any(Function),
            value: 'Respondent',
          },
          email: {
            content: expect.any(Function),
            value: 'john.doe@example.com',
          },
          invitationLink: {
            content: expect.any(Function),
            value: 'abc123',
            onClick: expect.any(Function),
            contentWithTooltip: expect.any(Object),
          },
          dateTimeInvited: {
            content: expect.any(Function),
            value: '2022-01-01T12:00:00',
          },
        },
      ]);
    });
  });
});
