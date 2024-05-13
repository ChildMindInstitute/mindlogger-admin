import { MenuItemType, Svg } from 'shared/components';
import { mockedAppletId, mockedRespondentId } from 'shared/mock';
import { variables } from 'shared/styles';
import { RespondentStatus } from 'modules/Dashboard/types';
import { ParticipantTag } from 'shared/consts';

import { getParticipantActions, getHeadCells } from './Participants.utils';

const dataTestId = 'test-id';

const applets = [
  {
    appletId: 'fbc90304-3fc9-4a71-a85f-aa7944278107',
    appletDisplayName: 'Applet 1',
    accessId: '8ee2c3ba-513a-4d1e-913d-fb69f0333ea4',
    respondentNickname: 'Jane Doe',
    respondentSecretId: 'janedoe',
    hasIndividualSchedule: false,
    subjectId: 'subj-1',
    subjectTag: 'Child' as ParticipantTag,
  },
  {
    appletId: 'b7db8ff7-6d0b-40fd-8dfc-93f96e7ad788',
    appletDisplayName: 'Applet 2',
    accessId: '115cd54d-17f0-43f4-8469-9f1802e2da5b',
    respondentNickname: 'Jane Doe',
    respondentSecretId: 'janedoe',
    hasIndividualSchedule: false,
    subjectId: 'subj-2',
    subjectTag: 'Child' as ParticipantTag,
  },
];

const filteredApplets = {
  scheduling: applets,
  editable: applets,
  viewable: applets,
};
const headCellProperties = [
  'pin',
  'tag',
  'secretIds',
  'nicknames',
  'accountType',
  'lastSeen',
  'actions',
];
const mockedEmail = 'test@test.com';
const commonGetActionsProps = {
  actions: {
    editParticipant: jest.fn(),
    upgradeAccount: jest.fn(),
    exportData: jest.fn(),
    removeParticipant: jest.fn(),
    assignActivity: jest.fn(),
  },
  filteredApplets,
  respondentId: mockedRespondentId,
  respondentOrSubjectId: mockedRespondentId,
  appletId: mockedAppletId,
  email: mockedEmail,
  secretId: 'test secret id',
  nickname: 'test nickname',
  tag: 'Child' as ParticipantTag,
};

const expectedContext = {
  respondentId: mockedRespondentId,
  email: mockedEmail,
  respondentOrSubjectId: mockedRespondentId,
  secretId: commonGetActionsProps.secretId,
  nickname: commonGetActionsProps.nickname,
  tag: commonGetActionsProps.tag,
};
const expectedActions = [
  {
    icon: <Svg id="edit" width={24} height={24} />,
    action: expect.any(Function),
    title: 'Edit Participant',
    context: expectedContext,
    isDisplayed: true,
    'data-testid': `${dataTestId}-edit`,
  },
  {
    icon: <Svg id="full-account" width={24} height={24} />,
    action: expect.any(Function),
    title: 'Upgrade to Full Account',
    context: expectedContext,
    isDisplayed: true,
    'data-testid': `${dataTestId}-upgrade-account`,
  },
  {
    icon: <Svg id="export" width={24} height={24} />,
    action: expect.any(Function),
    title: 'Export Data',
    context: expectedContext,
    isDisplayed: true,
    'data-testid': `${dataTestId}-export-data`,
  },
  {
    icon: <Svg id="remove-access" width={24} height={24} />,
    action: expect.any(Function),
    title: 'Remove Participant',
    context: expectedContext,
    isDisplayed: true,
    customItemColor: variables.palette.dark_error_container,
    'data-testid': `${dataTestId}-remove`,
  },
  {
    type: MenuItemType.Divider,
    isDisplayed: true,
  },
  {
    icon: <Svg id="add-users-outlined" width={24} height={24} />,
    action: expect.any(Function),
    title: 'Assign Activity',
    context: expectedContext,
    isDisplayed: true,
    'data-testid': `${dataTestId}-assign-activity`,
  },
];

describe('Participants utils tests', () => {
  describe('getParticipantActions function', () => {
    test('should return the correct actions if participant has full account', () => {
      const actions = getParticipantActions({
        ...commonGetActionsProps,
        status: RespondentStatus.Invited,
        dataTestid: dataTestId,
      });

      const isDisplayed = [true, false, true, true, true, true];
      actions.forEach((action, index) => {
        expect(action).toEqual({
          ...expectedActions[index],
          isDisplayed: isDisplayed[index],
        });
      });
    });

    test('should return the correct actions if participant has limited account', () => {
      const actions = getParticipantActions({
        ...commonGetActionsProps,
        status: RespondentStatus.NotInvited,
        dataTestid: dataTestId,
      });

      const isDisplayed = [true, true, true, true, true, true];
      actions.forEach((action, index) => {
        expect(action).toEqual({
          ...expectedActions[index],
          isDisplayed: isDisplayed[index],
        });
      });
    });

    test('should return the correct actions if invite is pending', () => {
      const actions = getParticipantActions({
        ...commonGetActionsProps,
        status: RespondentStatus.Pending,
        dataTestid: dataTestId,
      });

      const isDisplayed = [false, false, false, true, false, false];
      actions.forEach((action, index) => {
        expect(action).toEqual({
          ...expectedActions[index],
          isDisplayed: isDisplayed[index],
        });
      });
    });
  });

  describe('getHeadCells function', () => {
    test('returns the correct array of head cells without an id', () => {
      const headCells = getHeadCells();
      expect(headCells).toHaveLength(7);
      headCellProperties.forEach((property, index) => {
        expect(headCells[index]).toHaveProperty('id', property);
      });
    });

    test('returns the correct array of head cells with an id', () => {
      const headCells = getHeadCells(mockedAppletId);
      expect(headCells).toHaveLength(8);
      expect(headCells[6]).toHaveProperty('id', 'schedule');
      expect(headCells[7]).toHaveProperty('id', 'actions');
    });
  });
});
