import { MenuItemType, Svg } from 'shared/components';
import { mockedAppletId, mockedFullParticipantId1 } from 'shared/mock';
import { variables } from 'shared/styles';
import { ParticipantDetail, ParticipantStatus } from 'modules/Dashboard/types';
import { ParticipantTag, Roles } from 'shared/consts';
import { Invitation } from 'shared/types';

import { getParticipantActions, getHeadCells, cleanUpDividers } from './Participants.utils';
import {
  FilteredApplets,
  GetParticipantActionsProps,
  ParticipantActionProps,
} from './Participants.types';

describe('Participants utils tests', () => {
  describe('getParticipantActions function', () => {
    const dataTestId = 'test-id';

    const applets: ParticipantDetail[] = [
      {
        appletId: 'fbc90304-3fc9-4a71-a85f-aa7944278107',
        appletDisplayName: 'Applet 1',
        accessId: '8ee2c3ba-513a-4d1e-913d-fb69f0333ea4',
        respondentNickname: 'Jane Doe',
        respondentSecretId: 'janedoe',
        hasIndividualSchedule: false,
        subjectId: 'subj-1',
        subjectTag: 'Child' as ParticipantTag,
        subjectFirstName: 'Jane',
        subjectLastName: 'Doe',
        subjectCreatedAt: '2021-10-01T00:00:00.000Z',
        invitation: null,
        roles: [],
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
        subjectFirstName: 'Jane',
        subjectLastName: 'Doe',
        subjectCreatedAt: '2021-10-01T00:00:00.000Z',
        invitation: null,
        roles: [],
      },
    ];

    const filteredApplets: FilteredApplets = {
      scheduling: applets,
      editable: applets,
      viewable: applets,
    };

    const mockedEmail = 'test@test.com';

    const commonGetActionsProps: GetParticipantActionsProps = {
      actions: {
        editParticipant: jest.fn(),
        upgradeAccount: jest.fn(),
        exportData: jest.fn(),
        removeParticipant: jest.fn(),
        assignActivity: jest.fn(),
        copyEmailAddress: jest.fn(),
        copyInvitationLink: jest.fn(),
      },
      filteredApplets,
      respondentId: mockedFullParticipantId1,
      respondentOrSubjectId: mockedFullParticipantId1,
      appletId: mockedAppletId,
      email: mockedEmail,
      secretId: 'test secret id',
      nickname: 'test nickname',
      tag: 'Child' as ParticipantTag,
      canAssignActivity: true,
      invitation: null,
      firstName: 'Jane',
      lastName: 'Doe',
      subjectCreatedAt: '2021-10-01T00:00:00.000Z',
      status: ParticipantStatus.Invited,
      dataTestId,
      teamMemberCanViewData: true,
    };

    const expectedContext: ParticipantActionProps = {
      respondentId: mockedFullParticipantId1,
      email: mockedEmail,
      respondentOrSubjectId: mockedFullParticipantId1,
      secretId: commonGetActionsProps.secretId,
      nickname: commonGetActionsProps.nickname,
      tag: commonGetActionsProps.tag,
      invitation: null,
    };

    type MenuActionOptions = {
      isDisplayed?: boolean;
      context?: Partial<ParticipantActionProps>;
    };

    const summaryAction = (options: {
      email?: string;
      fullName?: string;
      invitationDate?: string;
      dateAdded?: string;
      isDisplayed?: boolean;
    }) => {
      let title = '';

      if (options.email) {
        title = `Email: ${options.email}`;
      }

      if (options.fullName) {
        title += title.length > 0 ? '\n' : '';
        title += `Full Name: ${options.fullName}`;
      }

      if (options.invitationDate) {
        title += title.length > 0 ? '\n' : '';
        title += `Invitation Date: ${options.invitationDate}`;
      }

      if (options.dateAdded) {
        title += title.length > 0 ? '\n' : '';
        title += `Date Added: ${options.dateAdded}`;
      }

      return {
        type: MenuItemType.Info,
        title,
        isDisplayed: options?.isDisplayed ?? true,
      };
    };

    const copyEmailAddressAction = (options?: MenuActionOptions) => ({
      icon: <Svg id="duplicate" width={24} height={24} />,
      action: expect.any(Function),
      title: 'Copy Email Address',
      context: { ...expectedContext, ...options?.context },
      isDisplayed: options?.isDisplayed ?? true,
      'data-testid': `${dataTestId}-copy-email`,
    });

    const copyInvitationLinkAction = (options?: MenuActionOptions) => ({
      icon: <Svg id="format-link" width={24} height={24} />,
      action: expect.any(Function),
      title: 'Copy Invitation Link',
      context: { ...expectedContext, ...options?.context },
      isDisplayed: options?.isDisplayed ?? true,
      'data-testid': `${dataTestId}-copy-invitation-link`,
    });

    const editParticipantAction = (options?: MenuActionOptions) => ({
      icon: <Svg id="edit" width={24} height={24} />,
      action: expect.any(Function),
      title: 'Edit Participant',
      context: { ...expectedContext, ...options?.context },
      isDisplayed: options?.isDisplayed ?? true,
      'data-testid': `${dataTestId}-edit`,
    });

    const upgradeToFullAccountAction = (options?: MenuActionOptions) => ({
      icon: <Svg id="full-account" width={24} height={24} />,
      action: expect.any(Function),
      title: 'Upgrade to Full Account',
      context: { ...expectedContext, ...options?.context },
      isDisplayed: options?.isDisplayed ?? true,
      'data-testid': `${dataTestId}-upgrade-account`,
    });

    const exportDataAction = (options?: MenuActionOptions) => ({
      icon: <Svg id="export" width={24} height={24} />,
      action: expect.any(Function),
      title: 'Export Data',
      context: { ...expectedContext, ...options?.context },
      isDisplayed: options?.isDisplayed ?? true,
      'data-testid': `${dataTestId}-export-data`,
      disabled: false,
      tooltip: '',
    });

    const removeParticipantAction = (options?: MenuActionOptions) => ({
      icon: <Svg id="remove-access" width={24} height={24} />,
      action: expect.any(Function),
      title: 'Remove Participant',
      context: { ...expectedContext, ...options?.context },
      isDisplayed: options?.isDisplayed ?? true,
      customItemColor: variables.palette.dark_error_container,
      'data-testid': `${dataTestId}-remove`,
    });

    const assignActivityAction = (options?: MenuActionOptions) => ({
      icon: <Svg id="add-users-outlined" width={24} height={24} />,
      action: expect.any(Function),
      title: 'Assign Activity',
      context: { ...expectedContext, ...options?.context },
      isDisplayed: options?.isDisplayed ?? true,
      'data-testid': `${dataTestId}-assign-activity`,
    });

    test('should return the correct actions if participant has full account', () => {
      const approvedInvitation: Invitation = {
        email: mockedEmail,
        appletId: applets[0].appletId,
        appletName: applets[0].appletDisplayName,
        key: '3a028213-4708-41b2-9dc2-c656ae4273a7',
        status: 'approved',
        createdAt: '2021-10-01T00:00:00.000Z',
        acceptedAt: '2021-10-01T12:00:00.000',
        firstName: 'Jane',
        lastName: 'Doe',
        nickname: commonGetActionsProps.nickname as string,
        role: commonGetActionsProps.tag as ParticipantTag,
        secretUserId: commonGetActionsProps.secretId,
        meta: {
          subject_id: 'ba1f11c8-df12-43f2-bc01-2c3df232fb48',
        },
        tag: commonGetActionsProps.tag as ParticipantTag,
        title: null,
      };
      const actions = getParticipantActions({
        ...commonGetActionsProps,
        status: ParticipantStatus.Invited,
        dataTestId,
        roles: [Roles.Manager],
        invitation: approvedInvitation,
      });
      const displayedActions = actions.filter((action) => action.isDisplayed);

      expect(displayedActions).toEqual([
        summaryAction({
          email: mockedEmail,
          fullName: 'Jane Doe',
          invitationDate: 'Oct 01, 2021 at 00:00',
        }),
        {
          type: MenuItemType.Divider,
          isDisplayed: true,
        },
        editParticipantAction({ context: { invitation: approvedInvitation } }),
        exportDataAction({ context: { invitation: approvedInvitation } }),
        removeParticipantAction({ context: { invitation: approvedInvitation } }),
        {
          type: MenuItemType.Divider,
          isDisplayed: true,
        },
        assignActivityAction({ context: { invitation: approvedInvitation } }),
      ]);
    });

    test('should return the correct actions if participant has limited account', () => {
      const actions = getParticipantActions({
        ...commonGetActionsProps,
        email: null,
        status: ParticipantStatus.NotInvited,
        dataTestId,
        roles: [Roles.Manager],
      });
      const displayedActions = actions.filter((action) => action.isDisplayed);

      expect(displayedActions).toEqual([
        summaryAction({ fullName: 'Jane Doe', dateAdded: 'Oct 01, 2021 at 00:00' }),
        {
          type: MenuItemType.Divider,
          isDisplayed: true,
        },
        editParticipantAction({ context: { email: null } }),
        upgradeToFullAccountAction({ context: { email: null } }),
        exportDataAction({ context: { email: null } }),
        removeParticipantAction({ context: { email: null } }),
        {
          type: MenuItemType.Divider,
          isDisplayed: true,
        },
        assignActivityAction({ context: { email: null } }),
      ]);
    });

    test('should return the correct actions if invite is pending', () => {
      const pendingInvitation: Invitation = {
        email: mockedEmail,
        appletId: applets[0].appletId,
        appletName: applets[0].appletDisplayName,
        key: '3a028213-4708-41b2-9dc2-c656ae4273a7',
        status: 'pending',
        createdAt: '2021-10-01T00:00:00.000Z',
        acceptedAt: null,
        firstName: 'Jane',
        lastName: 'Doe',
        nickname: commonGetActionsProps.nickname as string,
        role: commonGetActionsProps.tag as ParticipantTag,
        secretUserId: commonGetActionsProps.secretId,
        meta: {
          subject_id: 'ba1f11c8-df12-43f2-bc01-2c3df232fb48',
        },
        tag: commonGetActionsProps.tag as ParticipantTag,
        title: null,
      };
      const actions = getParticipantActions({
        ...commonGetActionsProps,
        status: ParticipantStatus.Pending,
        dataTestId,
        invitation: pendingInvitation,
        roles: [Roles.Manager],
      });
      const displayedActions = actions.filter((action) => action.isDisplayed);

      expect(displayedActions).toEqual([
        summaryAction({
          email: mockedEmail,
          fullName: 'Jane Doe',
          invitationDate: 'Oct 01, 2021 at 00:00',
        }),
        {
          type: MenuItemType.Divider,
          isDisplayed: true,
        },
        copyEmailAddressAction({ context: { invitation: pendingInvitation } }),
        {
          type: MenuItemType.Divider,
          isDisplayed: true,
        },
        copyInvitationLinkAction({ context: { invitation: pendingInvitation } }),
        removeParticipantAction({ context: { invitation: pendingInvitation } }),
      ]);
    });
  });

  describe('getHeadCells function', () => {
    const headCellProperties = [
      'pin',
      'tags',
      'secretIds',
      'nicknames',
      'status',
      'lastSeen',
      'actions',
    ];

    test('returns the correct array of head cells without an id', () => {
      const headCells = getHeadCells();
      expect(headCells).toHaveLength(7);
      headCellProperties.forEach((property, index) => {
        expect(headCells[index]).toHaveProperty('id', property);
      });
    });

    test('returns the correct array of head cells with an id', () => {
      const headCells = getHeadCells(undefined, mockedAppletId);
      expect(headCells).toHaveLength(8);
      expect(headCells[6]).toHaveProperty('id', 'schedule');
      expect(headCells[7]).toHaveProperty('id', 'actions');
    });
  });

  describe('cleanUpDividers function', () => {
    test('should hide dividers not between items', () => {
      const items = [
        { type: MenuItemType.Normal, isDisplayed: false },
        { type: MenuItemType.Divider, isDisplayed: true }, // Should be hidden
        { type: MenuItemType.Normal, isDisplayed: true },
        { type: MenuItemType.Divider, isDisplayed: true },
        { type: MenuItemType.Normal, isDisplayed: false },
        { type: MenuItemType.Divider, isDisplayed: true }, // Should be hidden
        { type: MenuItemType.Normal, isDisplayed: true },
        { type: MenuItemType.Divider, isDisplayed: true }, // Should be hidden
        { type: MenuItemType.Normal, isDisplayed: false },
      ];
      const result = cleanUpDividers(items);
      expect(result).toEqual([
        { type: MenuItemType.Normal, isDisplayed: false },
        { type: MenuItemType.Divider, isDisplayed: false },
        { type: MenuItemType.Normal, isDisplayed: true },
        { type: MenuItemType.Divider, isDisplayed: true },
        { type: MenuItemType.Normal, isDisplayed: false },
        { type: MenuItemType.Divider, isDisplayed: false },
        { type: MenuItemType.Normal, isDisplayed: true },
        { type: MenuItemType.Divider, isDisplayed: false },
        { type: MenuItemType.Normal, isDisplayed: false },
      ]);
    });
  });
});
