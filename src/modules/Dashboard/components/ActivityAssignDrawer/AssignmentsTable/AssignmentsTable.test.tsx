import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { useState } from 'react';
import { t } from 'i18next';

import { useParticipantDropdown } from 'modules/Dashboard/components';
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
import { mockGetRequestResponses, mockSuccessfulHttpResponse } from 'shared/utils/axios-mocks';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { initialStateData } from 'redux/modules';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { ParticipantTag, Roles } from 'shared/consts';
import { RespondentStatus } from 'modules/Dashboard/types';
import { ParticipantsData } from 'modules/Dashboard/features/Participants';
import { ManagersData } from 'modules/Dashboard/features';
import { ApiResponseCodes } from 'api';

import { selectParticipant } from '../ActivityAssignDrawer.test-utils';
import { AssignmentsTable } from './AssignmentsTable';
import { AssignmentsTableProps } from './AssignmentsTable.types';

/* Mock data
=================================================== */

const mockOnChange = jest.fn();
const mockTestId = 'test-id';
const mockedAssignment = {
  respondentSubjectId: mockedRespondent.details[0].subjectId,
  targetSubjectId: mockedRespondent2.details[0].subjectId,
};

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

/**
 * Wrapper for each component test
 */
const AssignmentsTableTest = (
  props: Pick<AssignmentsTableProps, 'assignments' | 'isReadOnly' | 'errors'>,
) => {
  const [assignments, setAssignments] = useState(props.assignments);
  const dropdownProps = useParticipantDropdown({ appletId: mockedAppletId });

  return (
    <AssignmentsTable
      {...dropdownProps}
      {...props}
      assignments={assignments}
      onChange={mockOnChange.mockImplementation(setAssignments)}
      data-testid={mockTestId}
    />
  );
};

/* Tests
=================================================== */

describe('AssignmentsTable', () => {
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

  it('should render the assignments table', () => {
    renderWithProviders(<AssignmentsTableTest assignments={[{}]} />, { preloadedState });
    const assignmentsTable = screen.getByTestId(mockTestId);
    expect(assignmentsTable).toBeInTheDocument();
  });

  it('when full account respondent is selected, should set both assignment respondent and target subject', async () => {
    renderWithProviders(<AssignmentsTableTest assignments={[{}]} />, { preloadedState });

    await selectParticipant('respondent', mockedRespondent.details[0].subjectId, 0, mockTestId);
    expect(mockOnChange).toHaveBeenLastCalledWith([
      {
        respondentSubjectId: mockedRespondent.details[0].subjectId,
        targetSubjectId: mockedRespondent.details[0].subjectId,
      },
    ]);
  });

  it('when manager account respondent is selected, should only set assignment respondent', async () => {
    renderWithProviders(<AssignmentsTableTest assignments={[{}]} />, { preloadedState });

    await selectParticipant(
      'respondent',
      mockedOwnerRespondent.details[0].subjectId,
      0,
      mockTestId,
    );
    expect(mockOnChange).toHaveBeenLastCalledWith([
      { respondentSubjectId: mockedOwnerRespondent.details[0].subjectId },
    ]);
  });

  it('when full account target subject is selected, should set assignment target subject', async () => {
    renderWithProviders(<AssignmentsTableTest assignments={[{}]} />, { preloadedState });

    await selectParticipant('target-subject', mockedRespondent.details[0].subjectId, 0, mockTestId);
    expect(mockOnChange).toHaveBeenLastCalledWith([
      { targetSubjectId: mockedRespondent.details[0].subjectId },
    ]);
  });

  it('when limited account target subject is selected, should set assignment target subject and show "Add Respondent" chip', async () => {
    renderWithProviders(<AssignmentsTableTest assignments={[{}]} />, { preloadedState });

    await selectParticipant(
      'target-subject',
      mockedLimitedRespondent.details[0].subjectId,
      0,
      mockTestId,
    );
    expect(mockOnChange).toHaveBeenLastCalledWith([
      { targetSubjectId: mockedLimitedRespondent.details[0].subjectId },
    ]);

    expect(screen.getByText('Add Respondent')).toBeInTheDocument();
  });

  it('should highlight duplicate rows', () => {
    renderWithProviders(
      <AssignmentsTableTest
        assignments={[mockedAssignment, mockedAssignment]}
        errors={{ duplicateRows: [`${mockedRespondent.id}_${mockedRespondent2.id}`] }}
        data-testid="assignments-table"
      />,
      { preloadedState },
    );

    const invalidRows = screen
      .getAllByRole('row')
      .filter((row) => row.getAttribute('aria-invalid'));
    expect(invalidRows).toHaveLength(2);
  });

  it('should add a new row when "Add Row" button is clicked', () => {
    renderWithProviders(<AssignmentsTableTest assignments={[mockedAssignment]} />, {
      preloadedState,
    });

    const addButton = screen.getByRole('button', { name: 'Add Row' });
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenLastCalledWith([
      mockedAssignment,
      { respondentSubjectId: null, targetSubjectId: null },
    ]);
  });

  it('should render participant snippets in read-only mode', async () => {
    renderWithProviders(<AssignmentsTableTest assignments={[mockedAssignment]} isReadOnly />, {
      preloadedState,
    });

    const respondentCell = screen.getByTestId(`${mockTestId}-0-cell-respondentSubjectId`);
    const subjectCell = screen.getByTestId(`${mockTestId}-0-cell-targetSubjectId`);

    await waitFor(() => {
      expect(within(respondentCell).getByText(mockedRespondent.secretIds[0])).toBeInTheDocument();
      expect(within(respondentCell).getByText(mockedRespondent.nicknames[0])).toBeInTheDocument();
      expect(
        within(respondentCell).getByText(
          t(`participantTag.${mockedRespondent.details[0].subjectTag}`),
        ),
      ).toBeInTheDocument();

      expect(within(subjectCell).getByText(mockedRespondent2.secretIds[0])).toBeInTheDocument();
      expect(within(subjectCell).getByText(mockedRespondent2.nicknames[0])).toBeInTheDocument();
      expect(
        within(subjectCell).getByText(
          t(`participantTag.${mockedRespondent2.details[0].subjectTag}`),
        ),
      ).toBeInTheDocument();
    });
  });
});
