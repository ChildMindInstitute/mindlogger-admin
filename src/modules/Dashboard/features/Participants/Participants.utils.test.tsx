import { Svg } from 'shared/components';
import { mockedAppletId, mockedRespondentId } from 'shared/mock';
import { variables } from 'shared/styles';

import { getParticipantActions, getHeadCells } from './Participants.utils';

const applets = [
  {
    appletId: 'fbc90304-3fc9-4a71-a85f-aa7944278107',
    appletDisplayName: 'Applet 1',
    accessId: '8ee2c3ba-513a-4d1e-913d-fb69f0333ea4',
    respondentNickname: 'Jane Doe',
    respondentSecretId: 'janedoe',
    hasIndividualSchedule: false,
    subjectId: 'subj-1',
  },
  {
    appletId: 'b7db8ff7-6d0b-40fd-8dfc-93f96e7ad788',
    appletDisplayName: 'Applet 2',
    accessId: '115cd54d-17f0-43f4-8469-9f1802e2da5b',
    respondentNickname: 'Jane Doe',
    respondentSecretId: 'janedoe',
    hasIndividualSchedule: false,
    subjectId: 'subj-2',
  },
];

const filteredApplets = {
  scheduling: applets,
  editable: applets,
  viewable: applets,
};
const headCellProperties = [
  'checkbox',
  'pin',
  'secretIds',
  'nicknames',
  'tags',
  'status',
  'lastSeen',
  'actions',
];
const mockedEmail = 'test@test.com';
const commonGetActionsProps = {
  actions: {
    scheduleSetupAction: jest.fn(),
    viewDataAction: jest.fn(),
    removeAccessAction: jest.fn(),
    userDataExportAction: jest.fn(),
    editParticipant: jest.fn(),
    sendInvitation: jest.fn(),
  },
  filteredApplets,
  respondentId: mockedRespondentId,
  respondentOrSubjectId: mockedRespondentId,
  appletId: mockedAppletId,
  email: mockedEmail,
};

describe('Participants utils tests', () => {
  describe('getParticipantActions function', () => {
    test('should return the correct actions for a participant with scheduling and viewable applets', () => {
      const actions = getParticipantActions({
        ...commonGetActionsProps,
        isViewCalendarEnabled: true,
        isInviteEnabled: true,
      });

      expect(actions).toEqual([
        {
          icon: <Svg id="calendar" width={20} height={21} />,
          action: expect.any(Function),
          title: 'View Individual Calendar',
          context: {
            respondentId: mockedRespondentId,
            email: mockedEmail,
            respondentOrSubjectId: mockedRespondentId,
          },
          isDisplayed: true,
          'data-testid': 'dashboard-participants-view-calendar',
        },
        {
          icon: <Svg id="data" width={22} height={22} />,
          action: expect.any(Function),
          title: 'View Data',
          context: {
            respondentId: mockedRespondentId,
            email: mockedEmail,
            respondentOrSubjectId: mockedRespondentId,
          },
          isDisplayed: true,
          'data-testid': 'dashboard-participants-view-data',
        },
        {
          icon: <Svg id="export2" width={20} height={21} />,
          action: expect.any(Function),
          title: 'Export Data',
          context: {
            respondentId: mockedRespondentId,
            email: mockedEmail,
            respondentOrSubjectId: mockedRespondentId,
          },
          isDisplayed: true,
          'data-testid': 'dashboard-participants-export-data',
        },
        {
          icon: <Svg id="edit" width={22} height={21} />,
          action: expect.any(Function),
          title: 'Edit Participant',
          context: {
            respondentId: mockedRespondentId,
            email: mockedEmail,
            respondentOrSubjectId: mockedRespondentId,
          },
          isDisplayed: true,
          'data-testid': 'dashboard-participants-edit',
        },
        {
          icon: <Svg id="remove-from-folder" width={21} height={21} />,
          action: expect.any(Function),
          title: 'Send Invitation',
          context: {
            respondentId: mockedRespondentId,
            email: mockedEmail,
            respondentOrSubjectId: mockedRespondentId,
          },
          isDisplayed: true,
          'data-testid': 'dashboard-participants-invite',
        },
        {
          icon: <Svg id="trash" width={21} height={21} />,
          action: expect.any(Function),
          title: 'Remove from Applet',
          context: {
            respondentId: mockedRespondentId,
            email: mockedEmail,
            respondentOrSubjectId: mockedRespondentId,
          },
          isDisplayed: true,
          customItemColor: variables.palette.dark_error_container,
          'data-testid': 'dashboard-participants-remove-access',
        },
      ]);

      actions.forEach((action) => expect(action.isDisplayed).toBe(true));
    });

    test('should return the correct actions if view calendar is not enabled', () => {
      const actions = getParticipantActions({
        ...commonGetActionsProps,
        isInviteEnabled: true,
        isViewCalendarEnabled: false,
      });

      actions.forEach((action, index) => {
        if (index === 0) {
          expect(action.isDisplayed).toBe(false);
        } else {
          expect(action.isDisplayed).toBe(true);
        }
      });
    });

    test('should return the correct actions if invite is not enabled', () => {
      const actions = getParticipantActions({
        ...commonGetActionsProps,
        isInviteEnabled: false,
        isViewCalendarEnabled: true,
      });

      actions.forEach((action, index) => {
        if (index === 4) {
          expect(action.isDisplayed).toBe(false);
        } else {
          expect(action.isDisplayed).toBe(true);
        }
      });
    });
  });

  describe('getHeadCells function', () => {
    test('returns the correct array of head cells without an id', () => {
      const headCells = getHeadCells();
      expect(headCells).toHaveLength(8);
      headCellProperties.forEach((property, index) => {
        expect(headCells[index]).toHaveProperty('id', property);
      });
    });

    test('returns the correct array of head cells with an id', () => {
      const headCells = getHeadCells(mockedAppletId);
      expect(headCells).toHaveLength(9);
      expect(headCells[7]).toHaveProperty('id', 'schedule');
      expect(headCells[8]).toHaveProperty('id', 'actions');
    });
  });
});
