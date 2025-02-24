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
  mockedLimitedParticipant,
  mockedOwnerId,
  mockedOwnerParticipant,
  mockedFullParticipant1,
  mockedFullParticipant2,
  mockedUserData,
  mockedFullParticipant1WithDataAccess,
  mockedFullParticipant2WithDataAccess,
  mockedOwnerParticipantWithDataAccess,
  mockedLimitedParticipantWithDataAccess,
} from 'shared/mock';
import { mockGetRequestResponses, mockSuccessfulHttpResponse } from 'shared/utils/axios-mocks';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { initialStateData } from 'redux/modules';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { Roles } from 'shared/consts';
import { ApiResponseCodes, WorkspaceManagersResponse, WorkspaceRespondentsResponse } from 'api';

import { selectParticipant } from '../ActivityAssignDrawer.test-utils';
import { AssignmentsTable } from './AssignmentsTable';
import { AssignmentsTableProps } from './AssignmentsTable.types';

/* Mock data
=================================================== */

const mockOnChange = jest.fn();
const mockTestId = 'test-id';
const mockedAssignment = {
  respondentSubjectId: mockedFullParticipant1.details[0].subjectId,
  targetSubjectId: mockedFullParticipant2.details[0].subjectId,
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
        if (params.userId === mockedOwnerParticipant.id) {
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

  it('should render the assignments table', () => {
    renderWithProviders(<AssignmentsTableTest assignments={[{}]} />, { preloadedState });
    const assignmentsTable = screen.getByTestId(mockTestId);
    expect(assignmentsTable).toBeInTheDocument();
  });

  it('when full account respondent is selected, should set both assignment respondent and target subject', async () => {
    renderWithProviders(<AssignmentsTableTest assignments={[{}]} />, { preloadedState });

    await selectParticipant(
      'respondent',
      mockedFullParticipant1.details[0].subjectId,
      0,
      mockTestId,
    );
    expect(mockOnChange).toHaveBeenLastCalledWith([
      {
        respondentSubjectId: mockedFullParticipant1.details[0].subjectId,
        targetSubjectId: mockedFullParticipant1.details[0].subjectId,
      },
    ]);
  });

  it('when manager account respondent is selected, should only set assignment respondent', async () => {
    renderWithProviders(<AssignmentsTableTest assignments={[{}]} />, { preloadedState });

    await selectParticipant(
      'respondent',
      mockedOwnerParticipant.details[0].subjectId,
      0,
      mockTestId,
    );
    expect(mockOnChange).toHaveBeenLastCalledWith([
      { respondentSubjectId: mockedOwnerParticipant.details[0].subjectId },
    ]);
  });

  it('when full account target subject is selected, should set assignment target subject', async () => {
    renderWithProviders(<AssignmentsTableTest assignments={[{}]} />, { preloadedState });

    await selectParticipant(
      'target-subject',
      mockedFullParticipant1.details[0].subjectId,
      0,
      mockTestId,
    );
    expect(mockOnChange).toHaveBeenLastCalledWith([
      { targetSubjectId: mockedFullParticipant1.details[0].subjectId },
    ]);
  });

  it('when limited account target subject is selected, should set assignment target subject and show "Add Respondent" chip', async () => {
    renderWithProviders(<AssignmentsTableTest assignments={[{}]} />, { preloadedState });

    await selectParticipant(
      'target-subject',
      mockedLimitedParticipant.details[0].subjectId,
      0,
      mockTestId,
    );
    expect(mockOnChange).toHaveBeenLastCalledWith([
      { targetSubjectId: mockedLimitedParticipant.details[0].subjectId },
    ]);

    expect(screen.getByText('Add Respondent')).toBeInTheDocument();
  });

  it('should highlight duplicate rows', () => {
    renderWithProviders(
      <AssignmentsTableTest
        assignments={[mockedAssignment, mockedAssignment]}
        errors={{ duplicateRows: [`${mockedFullParticipant1.id}_${mockedFullParticipant2.id}`] }}
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
      expect(
        within(respondentCell).getByText(mockedFullParticipant1.secretIds[0]),
      ).toBeInTheDocument();
      expect(
        within(respondentCell).getByText(mockedFullParticipant1.nicknames[0]),
      ).toBeInTheDocument();
      expect(
        within(respondentCell).getByText(
          t(`participantTag.${mockedFullParticipant1.details[0].subjectTag}`),
        ),
      ).toBeInTheDocument();

      expect(
        within(subjectCell).getByText(mockedFullParticipant2.secretIds[0]),
      ).toBeInTheDocument();
      expect(
        within(subjectCell).getByText(mockedFullParticipant2.nicknames[0]),
      ).toBeInTheDocument();
      expect(
        within(subjectCell).getByText(
          t(`participantTag.${mockedFullParticipant2.details[0].subjectTag}`),
        ),
      ).toBeInTheDocument();
    });
  });
});
