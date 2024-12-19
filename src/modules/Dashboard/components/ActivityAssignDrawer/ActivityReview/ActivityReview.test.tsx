import { fireEvent, screen, waitFor, within } from '@testing-library/react';

import { Activity, initialStateData } from 'redux/modules';
import {
  mockedApplet,
  mockedAppletData,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedEncryption,
  mockedLimitedRespondent,
  mockedOwnerId,
  mockedRespondent,
  mockedRespondent2,
  mockedUserData,
} from 'shared/mock';
import { useParticipantDropdown } from 'modules/Dashboard/components';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockGetRequestResponses, mockSuccessfulHttpResponse } from 'shared/utils/axios-mocks';
import { ParticipantTag, Roles } from 'shared/consts';
import { ParticipantStatus } from 'modules/Dashboard/types';
import { ParticipantsData } from 'modules/Dashboard/features/Participants';
import { ManagersData } from 'modules/Dashboard/features';

import { ActivityReviewProps } from './ActivityReview.types';
import { ActivityReview } from './ActivityReview';

const mockActivity = mockedAppletData.activities[0] as unknown as Activity;
const mockAssignments = [
  {
    respondentSubjectId: mockedRespondent.details[0].subjectId,
    targetSubjectId: mockedRespondent.details[0].subjectId,
  },
  {
    respondentSubjectId: mockedRespondent2.details[0].subjectId,
    targetSubjectId: mockedLimitedRespondent.details[0].subjectId,
  },
];

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
  status: ParticipantStatus.Invited,
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

const mockOnDelete = jest.fn();
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

  it('renders activity and assignments', async () => {
    renderWithProviders(<ActivityReviewTest index={0} isSingleActivity />, { preloadedState });

    expect(screen.getByText(mockActivity.name)).toBeInTheDocument();

    await waitFor(() => {
      // Respondent 1
      expect(screen.getByText(mockedRespondent.details[0].respondentSecretId)).toBeInTheDocument();
      expect(screen.getByText(mockedRespondent.details[0].respondentNickname)).toBeInTheDocument();

      // Subject 1
      expect(screen.getByText('Self')).toBeInTheDocument();

      // Respondent 2
      expect(screen.getByText(mockedRespondent2.details[0].respondentSecretId)).toBeInTheDocument();
      expect(screen.getByText(mockedRespondent2.details[0].respondentNickname)).toBeInTheDocument();

      // Subject 2
      expect(
        screen.getByText(mockedLimitedRespondent.details[0].respondentSecretId),
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockedLimitedRespondent.details[0].respondentNickname),
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
