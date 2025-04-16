import { screen, fireEvent, within, waitFor } from '@testing-library/react';
import { t } from 'i18next';
import mockAxios from 'jest-mock-axios';

import { ApiResponseCodes, WorkspaceManagersResponse, WorkspaceRespondentsResponse } from 'api';
import {
  mockedApplet,
  mockedAppletData,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedEncryption,
  mockedLimitedParticipant,
  mockedLimitedSubjectId,
  mockedOwnerId,
  mockedOwnerParticipant,
  mockedFullParticipant1,
  mockedUserData,
  mockedFullParticipant1WithDataAccess,
  mockedFullParticipant2WithDataAccess,
  mockedOwnerParticipantWithDataAccess,
  mockedLimitedParticipantWithDataAccess,
} from 'shared/mock';
import { Roles } from 'shared/consts';
import { mockGetRequestResponses, mockSuccessfulHttpResponse } from 'shared/utils/axios-mocks';
import { initialStateData } from 'redux/modules';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import * as MixpanelFunc from 'shared/utils/mixpanel';
import { MixpanelEventType, MixpanelProps } from 'shared/utils/mixpanel';

import { ActivityAssignDrawer } from './ActivityAssignDrawer';
import { checkAssignment, selectParticipant } from './ActivityAssignDrawer.test-utils';

/* Mock data
=================================================== */

const dataTestId = 'applet-activity-assign';
const mockedOnClose = vi.fn();

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

const mockedGetAppletParticipants = mockSuccessfulHttpResponse<WorkspaceRespondentsResponse>({
  result: [
    mockedFullParticipant1WithDataAccess,
    mockedFullParticipant2WithDataAccess,
    mockedOwnerParticipantWithDataAccess,
    mockedLimitedParticipantWithDataAccess,
  ],
  count: 4,
});

const mockedGetAppletManagers = mockSuccessfulHttpResponse<WorkspaceManagersResponse>({
  result: [
    {
      id: mockedOwnerParticipant.id as string,
      firstName: mockedUserData.firstName,
      lastName: mockedUserData.lastName,
      email: mockedOwnerParticipant.email as string,
      roles: [Roles.Owner],
      lastSeen: new Date().toDateString(),
      isPinned: mockedOwnerParticipant.isPinned,
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

const mockedAssignment = {
  activityId: mockedAppletData.activities[0].id,
  activityFlowId: null,
  respondentSubjectId: mockedFullParticipant1.details[0].subjectId,
  targetSubjectId: mockedFullParticipant1.details[0].subjectId,
};

const mockedLimitedAssignment = {
  activityId: mockedAppletData.activities[0].id,
  activityFlowId: null,
  respondentSubjectId: mockedFullParticipant1.details[0].subjectId,
  targetSubjectId: mockedLimitedParticipant.details[0].subjectId,
};

const GET_APPLET_URL = `/applets/${mockedAppletId}`;
const GET_APPLET_ACTIVITIES_URL = `/activities/applet/${mockedAppletId}`;
const GET_WORKSPACE_RESPONDENTS_URL = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`;
const GET_WORKSPACE_MANAGERS_URL = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`;
const APPLET_ASSIGNMENTS_URL = `/assignments/applet/${mockedAppletId}`;

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
  useFeatureFlags: vi.fn(),
}));

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

Element.prototype.scrollTo = vi.fn();

vi.useFakeTimers();
jest.setTimeout(10000);

const mixpanelTrack = vi.spyOn(MixpanelFunc.Mixpanel, 'track');

/* Tests
=================================================== */

describe('ActivityAssignDrawer', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: { enableActivityAssign: true, enableParticipantMultiInformant: true },
      resetLDContext: vi.fn(),
    });

    mockGetRequestResponses({
      [GET_APPLET_URL]: mockedGetApplet,
      [GET_APPLET_ACTIVITIES_URL]: mockedGetAppletActivities,
      [GET_WORKSPACE_MANAGERS_URL]: mockedGetAppletManagers,
      [GET_WORKSPACE_RESPONDENTS_URL]: (params) => {
        if (params.userId === mockedOwnerParticipant.id) {
          return mockSuccessfulHttpResponse<WorkspaceRespondentsResponse>({
            result: [mockedOwnerParticipantWithDataAccess],
            count: 1,
          });
        }

        return mockedGetAppletParticipants;
      },
      [APPLET_ASSIGNMENTS_URL]: mockSuccessfulHttpResponse({
        result: {
          appletId: mockedAppletId,
          assignments: [mockedAssignment],
        },
      }),
    });

    mixpanelTrack.mockReset();
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

    jest.advanceTimersToNextTimer();
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

    jest.advanceTimersToNextTimer();
    await waitFor(() => {
      const activityCheckbox = screen.getByTestId(
        `${dataTestId}-activities-list-activity-checkbox-${mockedAppletData.activities[0].id}`,
      );
      expect(within(activityCheckbox).getByRole('checkbox')).toBeChecked();

      expect(screen.getByRole('alert')).toHaveTextContent(
        'Your Activity was auto-filled, add Respondents to continue.',
      );

      expect(screen.queryByText('Next')).not.toBeVisible();
    });
  });

  it('toggles selection of all non-disabled activities and flows when toggling Select All', async () => {
    renderWithProviders(
      <ActivityAssignDrawer appletId={mockedAppletId} open onClose={mockedOnClose} />,
      { preloadedState },
    );

    jest.advanceTimersToNextTimer();
    await waitFor(() => {
      const selectAll = screen.getByText('Select All');

      const activities = screen.getAllByTestId(`${dataTestId}-activities-list-activity-item`);
      const flows = screen.getAllByTestId(`${dataTestId}-activities-list-flow-item`);

      fireEvent.click(selectAll);
      [...activities, ...flows].forEach((checkbox) => {
        const checkboxElement = within(checkbox).getByRole('checkbox');
        const itemIsNotDisabled = checkboxElement.getAttribute('disable') === 'false';

        if (itemIsNotDisabled) {
          expect(checkboxElement).toBeChecked();
        }
      });

      fireEvent.click(selectAll);
      [...activities, ...flows].forEach((checkbox) => {
        const checkboxElement = within(checkbox).getByRole('checkbox');
        const itemIsNotDisabled = checkboxElement.getAttribute('disable') === 'false';

        if (itemIsNotDisabled) {
          expect(checkboxElement).not.toBeChecked();
        }
      });
    });
  });

  it('prepopulates assignment respondent when passed Team Member respondent subject id', async () => {
    renderWithProviders(
      <ActivityAssignDrawer
        appletId={mockedAppletId}
        respondentSubjectId={mockedOwnerParticipant.details[0].subjectId}
        open
        onClose={mockedOnClose}
      />,
      { preloadedState },
    );

    jest.advanceTimersToNextTimer();
    await waitFor(() => {
      checkAssignment(`${mockedOwnerParticipant.nicknames[0]} (Team)`, '');

      expect(screen.getByRole('alert')).toHaveTextContent(
        '1 Respondent was added into the table, select an Activity and Subject to continue.',
      );

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

    jest.advanceTimersToNextTimer();
    await waitFor(() => {
      const subjectTag = t(`participantTag.${mockedLimitedParticipant.details[0].subjectTag}`);
      checkAssignment(
        '',
        `${mockedLimitedParticipant.secretIds[0]} (${mockedLimitedParticipant.nicknames[0]}) (${subjectTag})`,
      );

      expect(screen.getByText('Add Respondent')).toBeVisible();

      expect(screen.getByRole('alert')).toHaveTextContent(
        '1 Participant was added to the table. Please add a full account Respondent to continue.',
      );

      expect(screen.queryByText('Next')).not.toBeVisible();
    });
  });

  it('prepopulates assignment respondent and target subject when passed both subject ids', async () => {
    renderWithProviders(
      <ActivityAssignDrawer
        appletId={mockedAppletId}
        respondentSubjectId={mockedFullParticipant1.details[0].subjectId}
        targetSubjectId={mockedFullParticipant1.details[0].subjectId}
        open
        onClose={mockedOnClose}
      />,
      { preloadedState },
    );

    jest.advanceTimersToNextTimer();
    await waitFor(() => {
      const subjectTag = t(`participantTag.${mockedFullParticipant1.details[0].subjectTag}`);
      checkAssignment(
        `${mockedFullParticipant1.secretIds[0]} (${mockedFullParticipant1.nicknames[0]}) (${subjectTag})`,
        'Self',
      );

      expect(screen.getByRole('alert')).toHaveTextContent(
        '1 Participant was added into the table, select an Activity to continue.',
      );

      expect(screen.queryByText('Next')).not.toBeVisible();
    });
  });

  it('proceeds to Review step after successful submission', async () => {
    renderWithProviders(
      <ActivityAssignDrawer
        appletId={mockedAppletId}
        activityId={mockedAppletData.activities[0].id}
        respondentSubjectId={mockedFullParticipant1.details[0].subjectId}
        targetSubjectId={mockedLimitedParticipant.details[0].subjectId}
        open
        onClose={mockedOnClose}
      />,
      { preloadedState },
    );

    jest.advanceTimersToNextTimer();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The Participants & Activity have been auto-filled, click ‘Next’ to continue.',
    );

    const submitButton = screen.getByText('Next');
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    jest.advanceTimersToNextTimer();
    await waitFor(() => {
      expect(screen.getByText('Review')).toBeVisible();
    });
  });

  it('proceeds to Review step with warning if submitting some existing assignments', async () => {
    renderWithProviders(
      <ActivityAssignDrawer
        appletId={mockedAppletId}
        activityId={mockedAppletData.activities[0].id}
        respondentSubjectId={mockedFullParticipant1.details[0].subjectId}
        targetSubjectId={mockedFullParticipant1.details[0].subjectId}
        open
        onClose={mockedOnClose}
      />,
      { preloadedState },
    );

    jest.advanceTimersToNextTimer();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The Participant & Activity have been auto-filled, click ‘Next’ to continue.',
    );

    const addButton = screen.getByRole('button', { name: 'Add Row' });
    fireEvent.click(addButton);

    await selectParticipant('respondent', mockedFullParticipant1.details[0].subjectId, 1);
    await selectParticipant('target-subject', mockedLimitedParticipant.details[0].subjectId, 1);

    const submitButton = screen.getByText('Next');
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    jest.advanceTimersToNextTimer();
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'One or more of these Activities have already been assigned; no emails for those assignments will be sent.',
      );

      expect(screen.getByText('Review')).toBeVisible();
    });
  });

  it('does not proceed to Review step if submitting only existing assignments', async () => {
    renderWithProviders(
      <ActivityAssignDrawer
        appletId={mockedAppletId}
        activityId={mockedAppletData.activities[0].id}
        respondentSubjectId={mockedFullParticipant1.details[0].subjectId}
        targetSubjectId={mockedFullParticipant1.details[0].subjectId}
        open
        onClose={mockedOnClose}
      />,
      { preloadedState },
    );

    jest.advanceTimersToNextTimer();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The Participant & Activity have been auto-filled, click ‘Next’ to continue.',
    );

    const submitButton = screen.getByText('Next');
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    jest.advanceTimersToNextTimer();
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'All of the requested assignments already exist. Please create new unique assignments.',
      );

      expect(screen.getByText('Review')).not.toBeVisible();
    });
  });

  it('prevents proceeding to Review step if there are duplicate assignments', async () => {
    jest.setTimeout(20000);

    renderWithProviders(
      <ActivityAssignDrawer
        appletId={mockedAppletId}
        activityId={mockedAppletData.activities[0].id}
        respondentSubjectId={mockedFullParticipant1.details[0].subjectId}
        targetSubjectId={mockedFullParticipant1.details[0].subjectId}
        open
        onClose={mockedOnClose}
      />,
      { preloadedState },
    );

    jest.advanceTimersToNextTimer();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The Participant & Activity have been auto-filled, click ‘Next’ to continue.',
    );

    const addButton = screen.getByRole('button', { name: 'Add Row' });
    fireEvent.click(addButton);

    await selectParticipant('respondent', mockedFullParticipant1.details[0].subjectId, 1);
    await selectParticipant('target-subject', mockedFullParticipant1.details[0].subjectId, 1);

    const submitButton = screen.getByText('Next');
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    jest.advanceTimersToNextTimer();
    await waitFor(() => expect(submitButton).not.toBeEnabled());
    expect(await screen.findByText('Review')).not.toBeVisible();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'There are duplicate rows in the table, please edit or remove to continue.',
    );

    await selectParticipant('target-subject', mockedLimitedParticipant.details[0].subjectId, 1);
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('successfully submits assignments to the API', async () => {
    mockAxios.post.mockResolvedValue(
      mockSuccessfulHttpResponse({
        result: {
          appletId: mockedAppletId,
          assignments: [], // POST result is never used
        },
      }),
    );

    renderWithProviders(
      <ActivityAssignDrawer
        appletId={mockedAppletId}
        activityId={mockedAppletData.activities[0].id}
        respondentSubjectId={mockedFullParticipant1.details[0].subjectId}
        targetSubjectId={mockedFullParticipant1.details[0].subjectId}
        open
        onClose={mockedOnClose}
      />,
      { preloadedState },
    );

    jest.advanceTimersToNextTimer();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The Participant & Activity have been auto-filled, click ‘Next’ to continue.',
    );

    const addButton = screen.getByRole('button', { name: 'Add Row' });
    fireEvent.click(addButton);

    await selectParticipant('respondent', mockedFullParticipant1.details[0].subjectId, 1);
    await selectParticipant('target-subject', mockedLimitedParticipant.details[0].subjectId, 1);

    const submitButton = screen.getByText('Next');
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    jest.advanceTimersToNextTimer();
    await waitFor(() => {
      expect(screen.getByText('Review')).toBeVisible();
    });

    fireEvent.click(screen.getByText('Send Emails'));

    jest.advanceTimersToNextTimer();
    await waitFor(() => {
      expect(screen.getByText('Assigning to participants')).toBeVisible();
    });

    jest.advanceTimersToNextTimer();
    await waitFor(() => {
      expect(screen.getByText('Emails have been sent')).toBeVisible();

      expect(mixpanelTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          action: MixpanelEventType.ConfirmAssignActivityOrFlow,
          [MixpanelProps.AppletId]: mockedAppletId,
          [MixpanelProps.AssignmentCount]: 2,
          [MixpanelProps.SelfReportAssignmentCount]: 1,
          [MixpanelProps.MultiInformantAssignmentCount]: 1,
          [MixpanelProps.ActivityCount]: 1,
          [MixpanelProps.FlowCount]: 0,
        }),
      );

      expect(mockAxios.post).toBeCalledWith(APPLET_ASSIGNMENTS_URL, {
        assignments: [mockedAssignment, mockedLimitedAssignment].map((a) => ({
          activity_id: a.activityId,
          activity_flow_id: a.activityFlowId,
          respondent_subject_id: a.respondentSubjectId,
          target_subject_id: a.targetSubjectId,
        })),
      });
    });

    fireEvent.click(screen.getByText('Done'));
    expect(mockedOnClose).toHaveBeenCalled();
  });
});
