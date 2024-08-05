import { screen, fireEvent, within, waitFor } from '@testing-library/react';
import { t } from 'i18next';

import { ApiResponseCodes } from 'api';
import {
  mockedApplet,
  mockedAppletData,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedEncryption,
  mockedLimitedRespondent,
  mockedLimitedSubjectId,
  mockedOwnerId,
  mockedRespondent,
  mockedRespondent2,
  mockedUserData,
} from 'shared/mock';
import { ParticipantTag, Roles } from 'shared/consts';
import { RespondentStatus } from 'modules/Dashboard/types';
import { mockGetRequestResponses, mockSuccessfulHttpResponse } from 'shared/utils/axios-mocks';
import { ParticipantsData } from 'modules/Dashboard/features/Participants';
import { ManagersData } from 'modules/Dashboard/features';
import { initialStateData } from 'redux/modules';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ActivityAssignDrawer } from './ActivityAssignDrawer';
import { checkAssignment, selectParticipant } from './ActivityAssignDrawer.test-utils';

/* Mock data
=================================================== */

const dataTestId = 'applet-activity-assign';
const mockedOnClose = jest.fn();

const mockedGetAppletActivities = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: {
      activitiesDetails: mockedAppletData.activities,
      appletDetail: mockedAppletData,
    },
  },
};

const mockedGetApplet = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: { result: mockedAppletData },
};

const mockedOwnerRespondent = {
  id: mockedUserData.id,
  nicknames: [`${mockedUserData.firstName} ${mockedUserData.lastName}`],
  secretIds: ['mockedOwnerSecretId'],
  isAnonymousRespondent: false,
  lastSeen: new Date().toDateString(),
  isPinned: false,
  accessId: '912e17b8-195f-4685-b77b-137539b9054d',
  role: Roles.Owner,
  details: [
    {
      appletId: mockedAppletId,
      appletDisplayName: mockedApplet.displayName,
      appletImage: '',
      accessId: '912e17b8-195f-4685-b77b-137539b9054d',
      respondentNickname: `${mockedUserData.firstName} ${mockedUserData.lastName}`,
      respondentSecretId: 'mockedOwnerSecretId',
      hasIndividualSchedule: false,
      encryption: mockedApplet.encryption,
      subjectId: 'owner-subject-id-123',
      subjectTag: 'Team' as ParticipantTag,
      subjectFirstName: 'John',
      subjectLastName: 'Doe',
      subjectCreatedAt: '2023-09-26T12:11:46.162083',
      invitation: null,
    },
  ],
  status: RespondentStatus.Invited,
  email: mockedUserData.email,
};

const mockedGetAppletParticipants = mockSuccessfulHttpResponse<ParticipantsData>({
  result: [mockedRespondent, mockedRespondent2, mockedOwnerRespondent, mockedLimitedRespondent],
  count: 4,
});

const mockedGetAppletManagers = mockSuccessfulHttpResponse<ManagersData>({
  result: [
    {
      id: mockedOwnerRespondent.id,
      firstName: mockedUserData.firstName,
      lastName: mockedUserData.lastName,
      email: mockedOwnerRespondent.email,
      roles: [Roles.Owner],
      lastSeen: new Date().toDateString(),
      isPinned: mockedOwnerRespondent.isPinned,
      applets: [
        {
          id: mockedApplet.id,
          displayName: mockedApplet.displayName,
          image: '',
          roles: [
            {
              accessId: '912e17b8-195f-4685-b77b-137539b9054d',
              role: Roles.Owner,
            },
          ],
          encryption: mockedEncryption,
        },
      ],
      title: null,
      createdAt: new Date().toISOString(),
      titles: [],
      status: 'approved',
      invitationKey: null,
    },
  ],
  count: 1,
});

const GET_APPLET_URL = `/applets/${mockedAppletId}`;
const GET_APPLET_ACTIVITIES_URL = `/activities/applet/${mockedAppletId}`;
const GET_WORKSPACE_RESPONDENTS_URL = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`;
const GET_WORKSPACE_MANAGERS_URL = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`;

const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: initialStateData,
    workspacesRoles: initialStateData,
  },
};

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

// Required for duplicate assignments test on CI
jest.setTimeout(10000);

/* Tests
=================================================== */

describe('ActivityAssignDrawer', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: { enableActivityAssign: true, enableParticipantMultiInformant: true },
      resetLDContext: jest.fn(),
    });

    mockGetRequestResponses({
      [GET_APPLET_URL]: mockedGetApplet,
      [GET_APPLET_ACTIVITIES_URL]: mockedGetAppletActivities,
      [GET_WORKSPACE_MANAGERS_URL]: mockedGetAppletManagers,
      [GET_WORKSPACE_RESPONDENTS_URL]: (params) => {
        if (params.userId === mockedOwnerRespondent.id) {
          return mockSuccessfulHttpResponse<ParticipantsData>({
            result: [mockedOwnerRespondent],
            count: 1,
          });
        }

        return mockedGetAppletParticipants;
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    renderWithProviders(
      <ActivityAssignDrawer appletId={mockedAppletId} open onClose={mockedOnClose} />,
      { preloadedState },
    );

    expect(screen.getByTestId(dataTestId)).toBeInTheDocument();
    expect(screen.getByText('Assign Activity')).toBeInTheDocument();
  });

  it('calls onClose when closed', () => {
    renderWithProviders(
      <ActivityAssignDrawer appletId={mockedAppletId} open onClose={mockedOnClose} />,
      { preloadedState },
    );

    fireEvent.click(screen.getByLabelText('Close'));

    expect(mockedOnClose).toHaveBeenCalled();
  });

  it('lists available activities and activity flows', async () => {
    renderWithProviders(
      <ActivityAssignDrawer appletId={mockedAppletId} open onClose={mockedOnClose} />,
      { preloadedState },
    );

    await waitFor(() => {
      const activityItems = screen.getAllByTestId(`${dataTestId}-activities-list-activity-item`);
      expect(activityItems).toHaveLength(mockedAppletData.activities.length);

      const flowItems = screen.getAllByTestId(`${dataTestId}-activities-list-flow-item`);
      expect(flowItems).toHaveLength(mockedAppletData.activityFlows.length);
    });
  });

  it('preselects activity having passed activity id', async () => {
    renderWithProviders(
      <ActivityAssignDrawer
        appletId={mockedAppletId}
        activityId={mockedAppletData.activities[0].id}
        open
        onClose={mockedOnClose}
      />,
      { preloadedState },
    );

    await waitFor(() => {
      const activityCheckbox = screen.getByTestId(
        `${dataTestId}-activities-list-activity-checkbox-${mockedAppletData.activities[0].id}`,
      );
      expect(within(activityCheckbox).getByRole('checkbox')).toBeChecked();

      expect(
        within(screen.getByRole('alert')).getByText(
          'Your Activity was auto-filled, add Respondents to continue.',
        ),
      ).toBeVisible();

      expect(screen.queryByText('Next')).not.toBeVisible();
    });
  });

  it('toggles selection of all activities and flows when toggling Select All', async () => {
    renderWithProviders(
      <ActivityAssignDrawer appletId={mockedAppletId} open onClose={mockedOnClose} />,
      { preloadedState },
    );

    await waitFor(() => {
      const selectAll = screen.getByText('Select All');

      const activities = screen.getAllByTestId(`${dataTestId}-activities-list-activity-item`);
      const flows = screen.getAllByTestId(`${dataTestId}-activities-list-flow-item`);

      fireEvent.click(selectAll);
      [...activities, ...flows].forEach((checkbox) => {
        expect(within(checkbox).getByRole('checkbox')).toBeChecked();
      });

      fireEvent.click(selectAll);
      [...activities, ...flows].forEach((checkbox) => {
        expect(within(checkbox).getByRole('checkbox')).not.toBeChecked();
      });
    });
  });

  it('prepopulates assignment respondent when passed Team Member respondent subject id', async () => {
    renderWithProviders(
      <ActivityAssignDrawer
        appletId={mockedAppletId}
        respondentSubjectId={mockedOwnerRespondent.details[0].subjectId}
        open
        onClose={mockedOnClose}
      />,
      { preloadedState },
    );

    await waitFor(() => {
      checkAssignment(`${mockedOwnerRespondent.nicknames[0]} (Team)`, '');

      expect(
        within(screen.getByRole('alert')).getByText(
          `${mockedOwnerRespondent.nicknames[0]} was added into the table, select an Activity and Subject to continue.`,
        ),
      ).toBeVisible();

      expect(screen.queryByText('Next')).not.toBeVisible();
    });
  });

  it('prepopulates assignment target subject when passed limited account target subject id', async () => {
    renderWithProviders(
      <ActivityAssignDrawer
        appletId={mockedAppletId}
        targetSubjectId={mockedLimitedSubjectId}
        open
        onClose={mockedOnClose}
      />,
      { preloadedState },
    );

    await waitFor(() => {
      const subjectTag = t(`participantTag.${mockedLimitedRespondent.details[0].subjectTag}`);
      checkAssignment(
        '',
        `${mockedLimitedRespondent.secretIds[0]} (${mockedLimitedRespondent.nicknames[0]}) (${subjectTag})`,
      );

      expect(screen.getByText('Add Respondent')).toBeVisible();

      expect(
        within(screen.getByRole('alert')).getByText(
          `${mockedLimitedRespondent.nicknames[0]} was added to the table. Please add a full account Respondent to continue.`,
        ),
      ).toBeVisible();

      expect(screen.queryByText('Next')).not.toBeVisible();
    });
  });

  it('prepopulates assignment respondent and target subject when passed both subject ids', async () => {
    renderWithProviders(
      <ActivityAssignDrawer
        appletId={mockedAppletId}
        respondentSubjectId={mockedRespondent.details[0].subjectId}
        targetSubjectId={mockedRespondent.details[0].subjectId}
        open
        onClose={mockedOnClose}
      />,
      { preloadedState },
    );

    await waitFor(() => {
      const subjectTag = t(`participantTag.${mockedRespondent.details[0].subjectTag}`);
      checkAssignment(
        `${mockedRespondent.secretIds[0]} (${mockedRespondent.nicknames[0]}) (${subjectTag})`,
        'Self',
      );

      expect(
        within(screen.getByRole('alert')).getByText(
          `${mockedRespondent.nicknames[0]} was added into the table, select an Activity to continue.`,
        ),
      ).toBeVisible();

      expect(screen.queryByText('Next')).not.toBeVisible();
    });
  });

  it('proceeds to Review step after successful submission', async () => {
    renderWithProviders(
      <ActivityAssignDrawer
        appletId={mockedAppletId}
        activityId={mockedAppletData.activities[0].id}
        respondentSubjectId={mockedRespondent.details[0].subjectId}
        targetSubjectId={mockedRespondent.details[0].subjectId}
        open
        onClose={mockedOnClose}
      />,
      { preloadedState },
    );

    await waitFor(() => {
      expect(
        within(screen.getByRole('alert')).getByText(
          'The Participant & Activity have been auto-filled, click ‘Next’ to continue.',
        ),
      ).toBeVisible();

      fireEvent.click(screen.getByText('Next'));

      expect(screen.getByText('Review')).toBeVisible();
    });
  });

  it('prevents proceeding to Review step if there are duplicate assignments', async () => {
    renderWithProviders(
      <ActivityAssignDrawer
        appletId={mockedAppletId}
        activityId={mockedAppletData.activities[0].id}
        respondentSubjectId={mockedRespondent.details[0].subjectId}
        targetSubjectId={mockedRespondent.details[0].subjectId}
        open
        onClose={mockedOnClose}
      />,
      { preloadedState },
    );

    await waitFor(() => {
      expect(
        within(screen.getByRole('alert')).getByText(
          'The Participant & Activity have been auto-filled, click ‘Next’ to continue.',
        ),
      ).toBeVisible();
    });

    const addButton = screen.getByRole('button', { name: 'Add Row' });
    fireEvent.click(addButton);

    await selectParticipant('target-subject', mockedRespondent.details[0].subjectId, 1);
    await selectParticipant('respondent', mockedRespondent.details[0].subjectId, 1);

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.queryByText('Review')).not.toBeVisible();

      expect(
        within(screen.getByRole('alert')).getByText(
          'There are duplicate rows in the table, please edit or remove to continue.',
        ),
      ).toBeVisible();
    });
  });
});
