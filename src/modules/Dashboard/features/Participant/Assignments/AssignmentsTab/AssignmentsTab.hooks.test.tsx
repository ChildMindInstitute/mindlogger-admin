import { fireEvent, screen, waitFor } from '@testing-library/react';
import { generatePath } from 'react-router-dom';
import { PreloadedState } from '@reduxjs/toolkit';
import { Button } from '@mui/material';
import userEvent from '@testing-library/user-event';

import { ApiResponseCodes, ParticipantActivityOrFlow } from 'api';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import {
  mockParticipantFlows,
  mockParticipantActivities,
  mockedAppletData,
  mockedAppletId,
  mockedLimitedRespondent,
  mockedLimitedSubject,
  mockedOwnerId,
  mockedOwnerManager,
  mockedOwnerRespondent,
  mockedOwnerSubject,
} from 'shared/mock';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockGetRequestResponses,
  mockSchema,
  mockSuccessfulHttpResponse,
} from 'shared/utils/axios-mocks';
import { RootState } from 'redux/store';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { ParticipantsData } from 'modules/Dashboard/features/Participants';
import { ManagersData } from 'modules/Dashboard/features/Managers';
import {
  openTakeNowModal,
  sourceSubjectDropdownTestId,
  targetSubjectDropdownTestId,
} from 'modules/Dashboard/components/TakeNowModal/TakeNowModal.test-utils';
import { ActionsMenu } from 'shared/components';
import { RespondentDetails } from 'modules/Dashboard/types';
import { EditablePerformanceTasksType } from 'modules/Builder/features/Activities/Activities.types';
import { getPerformanceTaskPath } from 'modules/Builder/features/Activities/Activities.utils';

import { useAssignmentsTab } from './AssignmentsTab.hooks';

/* Mocks
=================================================== */

const successfulGetAppletMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: { result: mockedAppletData },
};

const successfulGetAppletActivitiesMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: {
      activitiesDetails: mockedAppletData.activities,
      appletDetail: mockedAppletData,
    },
  },
};

const getAppletUrl = `/applets/${mockedAppletId}`;
const getAppletActivitiesUrl = `/activities/applet/${mockedAppletId}`;
const getWorkspaceRespondentsUrl = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`;
const getWorkspaceManagersUrl = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`;

const testId = 'assignments-tab';
const route = `/dashboard/${mockedAppletId}/participants/${mockedOwnerRespondent.details[0].subjectId}`;
const routePath = page.appletParticipantDetails;

const preloadedState: PreloadedState<RootState> = {
  ...getPreloadedState(),
  users: {
    respondentDetails: mockSchema(null),
    allRespondents: mockSchema(null, {
      status: 'idle',
    }),
    subjectDetails: mockSchema({
      result: mockedOwnerSubject,
    }),
  },
};

const renderOptions = {
  preloadedState,
  route,
  routePath,
};

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

const mockHandleRefetch = jest.fn();

const mockGetAppletPrivateKey = jest.fn();

jest.mock('shared/hooks/useEncryptionStorage', () => ({
  useEncryptionStorage: () => ({
    getAppletPrivateKey: mockGetAppletPrivateKey,
  }),
}));

/* Test Component
=================================================== */

const UseAssignmentsHookTest = ({
  activityOrFlow,
  targetSubject,
  respondentSubject,
}: {
  activityOrFlow: ParticipantActivityOrFlow;
  targetSubject?: RespondentDetails;
  respondentSubject?: RespondentDetails;
}) => {
  const { getActionsMenu, onClickNavigateToData, modals } = useAssignmentsTab({
    appletId: mockedAppletId,
    targetSubject,
    respondentSubject,
    handleRefetch: mockHandleRefetch,
    dataTestId: testId,
  });

  return (
    <>
      {targetSubject && (
        <Button
          onClick={() => onClickNavigateToData(activityOrFlow, targetSubject.id)}
          data-testid={`${testId}-view-data`}
        >
          View Data
        </Button>
      )}
      <ActionsMenu
        menuItems={getActionsMenu(activityOrFlow)}
        data-testid={`${testId}-activity-actions`}
      />

      {modals}
    </>
  );
};

/* Tests
=================================================== */

describe('useAssignmentsTab hook', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableParticipantMultiInformant: true,
        enableActivityAssign: true,
      },
      resetLDContext: jest.fn(),
    });

    mockGetRequestResponses({
      [getAppletUrl]: successfulGetAppletMock,
      [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
      [getWorkspaceRespondentsUrl]: ({ userId }) => {
        const respondents = [mockedOwnerRespondent, mockedLimitedRespondent];
        const filteredRespondents = userId
          ? respondents.filter((r) => r.id === userId)
          : respondents;

        return mockSuccessfulHttpResponse<ParticipantsData>({
          result: filteredRespondents,
          count: filteredRespondents.length,
        });
      },
      [getWorkspaceManagersUrl]: mockSuccessfulHttpResponse<ManagersData>({
        result: [mockedOwnerManager],
        count: 1,
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Edit', () => {
    describe('should show or hide edit ability depending on role', () => {
      test.each`
        canEdit  | role                 | description
        ${true}  | ${Roles.Manager}     | ${'editing for Manager'}
        ${true}  | ${Roles.SuperAdmin}  | ${'editing for SuperAdmin'}
        ${true}  | ${Roles.Owner}       | ${'editing for Owner'}
        ${false} | ${Roles.Coordinator} | ${'editing for Coordinator'}
        ${true}  | ${Roles.Editor}      | ${'editing for Editor'}
        ${false} | ${Roles.Respondent}  | ${'editing for Respondent'}
        ${false} | ${Roles.Reviewer}    | ${'editing for Reviewer'}
      `('$description', async ({ canEdit, role }) => {
        renderWithProviders(
          <UseAssignmentsHookTest activityOrFlow={mockParticipantActivities.autoAssignActivity} />,
          {
            ...renderOptions,
            preloadedState: { ...renderOptions.preloadedState, ...getPreloadedState(role) },
          },
        );

        const actionDots = screen.queryAllByTestId(`${testId}-activity-actions-dots`)[0];
        if (actionDots && canEdit) {
          userEvent.click(actionDots);
          await waitFor(() => expect(screen.getByTestId(`${testId}-edit`)).toBeVisible());

          fireEvent.click(screen.getByTestId(`${testId}-edit`));
          expect(mockedUseNavigate).toHaveBeenCalledWith(
            generatePath(page.builderAppletActivity, {
              appletId: mockedAppletId,
              activityId: mockParticipantActivities.autoAssignActivity.id,
            }),
          );
        } else {
          await waitFor(() => expect(screen.queryByTestId(`${testId}-edit`)).toBeNull());
        }
      });
    });

    test('should navigate to appropriate edit URL for flow', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantFlows.autoAssignFlow}
          targetSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      const actionDots = screen.queryByTestId(`${testId}-activity-actions-dots`);
      if (actionDots) {
        userEvent.click(actionDots);
        await waitFor(() => expect(screen.getByTestId(`${testId}-edit`)).toBeVisible());

        fireEvent.click(screen.getByTestId(`${testId}-edit`));
        expect(mockedUseNavigate).toHaveBeenCalledWith(
          generatePath(page.builderAppletActivityFlowItemAbout, {
            appletId: mockedAppletId,
            activityFlowId: mockParticipantFlows.autoAssignFlow.id,
          }),
        );
      }
    });

    test('should navigate to appropriate edit URL for performance task', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.performanceTaskActivity}
          targetSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      const actionDots = screen.queryByTestId(`${testId}-activity-actions-dots`);
      if (actionDots) {
        userEvent.click(actionDots);
        await waitFor(() => expect(screen.getByTestId(`${testId}-edit`)).toBeVisible());

        fireEvent.click(screen.getByTestId(`${testId}-edit`));
        expect(mockedUseNavigate).toHaveBeenCalledWith(
          generatePath(
            getPerformanceTaskPath(
              mockParticipantActivities.performanceTaskActivity
                .performanceTaskType as unknown as EditablePerformanceTasksType,
            ),
            {
              appletId: mockedAppletId,
              activityId: mockParticipantActivities.performanceTaskActivity.id,
            },
          ),
        );
      }
    });
  });

  describe('View Data', () => {
    test.each`
      activityOrFlow                                  | route                                                   | param               | description
      ${mockParticipantActivities.autoAssignActivity} | ${page.appletParticipantActivityDetailsDataSummary}     | ${'activityId'}     | ${'activity'}
      ${mockParticipantFlows.autoAssignFlow}          | ${page.appletParticipantActivityDetailsFlowDataSummary} | ${'activityFlowId'} | ${'flow'}
    `(
      'should navigate to appropriate view data URL for $description',
      async ({ activityOrFlow, route, param }) => {
        const { rerender } = renderWithProviders(
          <UseAssignmentsHookTest
            activityOrFlow={activityOrFlow}
            targetSubject={mockedOwnerSubject}
          />,
          renderOptions,
        );

        const viewDataButton = screen.getByTestId(`${testId}-view-data`);

        // Attempt to view data without encryption key
        fireEvent.click(viewDataButton);
        expect(mockedUseNavigate).not.toHaveBeenCalled();
        expect(screen.getByTestId('unlock-applet-data-popup')).toBeVisible();

        // Attempt to view data with encryption key
        mockGetAppletPrivateKey.mockReturnValue('mockedPrivateKey');

        rerender(
          <UseAssignmentsHookTest
            activityOrFlow={activityOrFlow}
            targetSubject={mockedOwnerSubject}
          />,
        );

        fireEvent.click(viewDataButton);
        expect(mockedUseNavigate).toHaveBeenCalledWith(
          generatePath(route, {
            appletId: mockedAppletId,
            subjectId: mockedOwnerSubject.id,
            [param]: activityOrFlow.id,
          }),
        );
      },
    );
  });

  describe('Take Now', () => {
    describe('should show or hide Take Now button depending on role', () => {
      test.each`
        canDoTakeNow | role                 | description
        ${true}      | ${Roles.Manager}     | ${'Take Now for Manager'}
        ${true}      | ${Roles.SuperAdmin}  | ${'Take Now for SuperAdmin'}
        ${true}      | ${Roles.Owner}       | ${'Take Now for Owner'}
        ${false}     | ${Roles.Coordinator} | ${'Take Now for Coordinator'}
        ${false}     | ${Roles.Editor}      | ${'Take Now for Editor'}
        ${false}     | ${Roles.Respondent}  | ${'Take Now for Respondent'}
        ${false}     | ${Roles.Reviewer}    | ${'Take Now for Reviewer'}
      `('$description', async ({ canDoTakeNow, role }: { canDoTakeNow: boolean; role: Roles }) => {
        renderWithProviders(
          <UseAssignmentsHookTest
            activityOrFlow={mockParticipantActivities.autoAssignActivity}
            targetSubject={mockedOwnerSubject}
          />,
          {
            ...renderOptions,
            preloadedState: { ...renderOptions.preloadedState, ...getPreloadedState(role) },
          },
        );

        const actionDots = screen.queryByTestId(`${testId}-activity-actions-dots`);
        if (actionDots && canDoTakeNow) {
          userEvent.click(actionDots);
          await waitFor(() =>
            expect(screen.getByTestId(`${testId}-activity-take-now`)).toBeVisible(),
          );
        } else {
          await waitFor(() =>
            expect(screen.queryByTestId(`${testId}-activity-take-now`)).toBeNull(),
          );
        }
      });
    });

    test('should be disabled for mobile-only activities', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.mobileOnlyActivity}
          targetSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      const actionDots = screen.queryByTestId(`${testId}-activity-actions-dots`);
      if (actionDots) {
        userEvent.click(actionDots);
        await waitFor(() => {
          expect(screen.getByTestId(`${testId}-activity-take-now`)).toBeVisible();
          expect(screen.getByTestId(`${testId}-activity-take-now`)).toHaveAttribute(
            'aria-disabled',
            'true',
          );
        });
      }
    });

    test('should pre-populate subject in Take Now modal', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.autoAssignActivity}
          targetSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      await openTakeNowModal(testId);

      const sourceSubjectInputElement = screen
        .getByTestId(sourceSubjectDropdownTestId(testId))
        .querySelector('input');

      const targetSubjectInputElement = screen
        .getByTestId(targetSubjectDropdownTestId(testId))
        .querySelector('input');

      const { firstName, lastName, tag } = mockedOwnerSubject;

      expect(sourceSubjectInputElement).toHaveValue('');
      expect(targetSubjectInputElement).toHaveValue(`${firstName} ${lastName} (${tag})`);
    });

    test('should pre-populate both respondent and subject in Take Now modal', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.autoAssignActivity}
          respondentSubject={mockedOwnerSubject}
          targetSubject={mockedLimitedSubject}
        />,
        renderOptions,
      );

      await openTakeNowModal(testId);

      const sourceSubjectInputElement = screen
        .getByTestId(sourceSubjectDropdownTestId(testId))
        .querySelector('input');

      const targetSubjectInputElement = screen
        .getByTestId(targetSubjectDropdownTestId(testId))
        .querySelector('input');

      expect(sourceSubjectInputElement).toHaveValue(
        `${mockedOwnerSubject.firstName} ${mockedOwnerSubject.lastName} (${mockedOwnerSubject.tag})`,
      );
      expect(targetSubjectInputElement).toHaveValue(
        `${mockedLimitedSubject.secretUserId} (${mockedLimitedSubject.nickname}) (${mockedLimitedSubject.tag})`,
      );
    });
  });
});
