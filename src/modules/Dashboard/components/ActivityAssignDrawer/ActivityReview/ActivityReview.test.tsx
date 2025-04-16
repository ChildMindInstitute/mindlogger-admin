import { fireEvent, screen, waitFor, within } from '@testing-library/react';

import { Activity, initialStateData } from 'redux/modules';
import {
  mockedApplet,
  mockedAppletData,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedEncryption,
  mockedFullParticipant1,
  mockedFullParticipant1WithDataAccess,
  mockedFullParticipant2,
  mockedFullParticipant2WithDataAccess,
  mockedLimitedParticipant,
  mockedLimitedParticipantWithDataAccess,
  mockedOwnerId,
  mockedOwnerParticipantWithDataAccess,
  mockedUserData,
} from 'shared/mock';
import { useParticipantDropdown } from 'modules/Dashboard/components';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockGetRequestResponses, mockSuccessfulHttpResponse } from 'shared/utils/axios-mocks';
import { ParticipantTag, Roles } from 'shared/consts';
import { Participant, ParticipantStatus } from 'modules/Dashboard/types';
import { WorkspaceManagersResponse, WorkspaceRespondentsResponse } from 'api';

import { ActivityReviewProps } from './ActivityReview.types';
import { ActivityReview } from './ActivityReview';

const mockActivity = mockedAppletData.activities[0] as unknown as Activity;
const mockAssignments = [
  {
    respondentSubjectId: mockedFullParticipant1.details[0].subjectId,
    targetSubjectId: mockedFullParticipant1.details[0].subjectId,
  },
  {
    respondentSubjectId: mockedFullParticipant2.details[0].subjectId,
    targetSubjectId: mockedLimitedParticipant.details[0].subjectId,
  },
];

const mockedOwnerRespondent: Participant = {
  id: mockedUserData.id,
  nicknames: [`${mockedUserData.firstName} ${mockedUserData.lastName}`],
  secretIds: ['mockedOwnerSecretId'],
  isAnonymousRespondent: false,
  lastSeen: new Date().toDateString(),
  isPinned: false,
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
      subjectUpdatedAt: '2023-09-26T12:11:46.162083',
      subjectIsDeleted: false,
      invitation: null,
      roles: [Roles.Owner, Roles.Respondent],
    },
  ],
  status: ParticipantStatus.Invited,
  email: mockedUserData.email,
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
      id: mockedOwnerRespondent.id as string,
      firstName: mockedUserData.firstName,
      lastName: mockedUserData.lastName,
      email: mockedOwnerRespondent.email as string,
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

const mockOnDelete = vi.fn();
const dataTestId = 'test-id';

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

/**
 * Wrapper for each component test
 */
const ActivityReviewTest = (props: Pick<ActivityReviewProps, 'index' | 'isSingleActivity'>) => {
  const dropdownProps = useParticipantDropdown({ appletId: mockedAppletId });

  return (
    <ActivityReview
      {...props}
      {...dropdownProps}
      activity={mockActivity}
      assignments={mockAssignments}
      onDelete={mockOnDelete}
      data-testid={dataTestId}
    />
  );
};

/* Tests
=================================================== */

describe('ActivityReview component', () => {
  beforeEach(() => {
    mockGetRequestResponses({
      [GET_WORKSPACE_MANAGERS_URL]: mockedGetAppletManagers,
      [GET_WORKSPACE_RESPONDENTS_URL]: (params) => {
        if (params.userId === mockedOwnerRespondent.id) {
          return mockSuccessfulHttpResponse<WorkspaceRespondentsResponse>({
            result: [mockedOwnerParticipantWithDataAccess],
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

  it('renders activity and assignments', async () => {
    renderWithProviders(<ActivityReviewTest index={0} isSingleActivity />, { preloadedState });

    expect(screen.getByText(mockActivity.name)).toBeInTheDocument();

    await waitFor(() => {
      // Respondent 1
      expect(
        screen.getByText(mockedFullParticipant1.details[0].respondentSecretId),
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockedFullParticipant1.details[0].respondentNickname),
      ).toBeInTheDocument();

      // Subject 1
      expect(screen.getByText('Self')).toBeInTheDocument();

      // Respondent 2
      expect(
        screen.getByText(mockedFullParticipant2.details[0].respondentSecretId),
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockedFullParticipant2.details[0].respondentNickname),
      ).toBeInTheDocument();

      // Subject 2
      expect(
        screen.getByText(mockedLimitedParticipant.details[0].respondentSecretId),
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockedLimitedParticipant.details[0].respondentNickname),
      ).toBeInTheDocument();

      // Assignment counts
      expect(screen.getByText('1 Self-Report')).toBeInTheDocument();
      expect(screen.getByText('1 Multi-Informant')).toBeInTheDocument();
    });
  });

  it('renders as expanded if first activity', () => {
    renderWithProviders(<ActivityReviewTest index={0} />, { preloadedState });

    const accordion = screen.getByTestId(dataTestId);
    const buttons = within(accordion).getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders as expanded and cannot be deleted if single activity', () => {
    renderWithProviders(<ActivityReviewTest index={1} isSingleActivity />, { preloadedState });

    const accordion = screen.getByTestId(dataTestId);
    const buttons = within(accordion).getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');

    expect(screen.queryByTestId(`${dataTestId}-0-delete-button`)).not.toBeInTheDocument();
  });

  it('renders as collapsed if not first or single activity', () => {
    renderWithProviders(<ActivityReviewTest index={1} />, { preloadedState });

    const accordion = screen.getByTestId(dataTestId);
    const buttons = within(accordion).getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithProviders(<ActivityReviewTest index={0} />, { preloadedState });

    const deleteButton = screen.getByTestId(`${dataTestId}-0-delete-button`);
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalled();
  });
});
