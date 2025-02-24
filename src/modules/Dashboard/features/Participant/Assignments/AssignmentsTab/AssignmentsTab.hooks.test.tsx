import { screen, within } from '@testing-library/react';
import { generatePath } from 'react-router-dom';
import { PreloadedState } from '@reduxjs/toolkit';
import { Button } from '@mui/material';
import userEvent from '@testing-library/user-event';

import {
  ApiResponseCodes,
  ParticipantActivityOrFlow,
  WorkspaceManagersResponse,
  WorkspaceRespondentsResponse,
} from 'api';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import {
  mockParticipantFlows,
  mockParticipantActivities,
  mockedAppletData,
  mockedAppletId,
  mockedLimitedSubject,
  mockedOwnerId,
  mockedOwnerManager,
  mockedOwnerParticipant,
  mockedOwnerSubject,
  mockedFullSubject1,
  mockedOwnerSubjectWithDataAccess,
  mockedOwnerParticipantWithDataAccess,
  mockedFullParticipant1WithDataAccess,
  mockedLimitedParticipantWithDataAccess,
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
import {
  openTakeNowModal,
  sourceSubjectDropdownTestId,
  targetSubjectDropdownTestId,
} from 'modules/Dashboard/components/TakeNowModal/TakeNowModal.test-utils';
import { ActionsMenu } from 'shared/components';
import { EditablePerformanceTasksType } from 'modules/Builder/features/Activities/Activities.types';
import { getPerformanceTaskPath } from 'modules/Builder/features/Activities/Activities.utils';
import {
  Mixpanel,
  MixpanelEventType,
  MixpanelProps,
  StartAssignActivityOrFlowEvent,
  StartUnassignActivityOrFlowEvent,
} from 'shared/utils';
import { SubjectDetailsWithDataAccess } from 'modules/Dashboard/types';

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

const GET_APPLET_URL = `/applets/${mockedAppletId}`;
const GET_APPLET_ACTIVITIES_URL = `/activities/applet/${mockedAppletId}`;
const GET_WORKSPACE_RESPONDENTS_URL = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`;
const GET_WORKSPACE_MANAGERS_URL = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`;

const testId = 'assignments-tab';
const route = `/dashboard/${mockedAppletId}/participants/${mockedOwnerParticipant.details[0].subjectId}`;
const routePath = page.appletParticipantDetails;

const preloadedState: PreloadedState<RootState> = {
  ...getPreloadedState(),
  users: {
    respondentDetails: mockSchema(null),
    subjectDetails: mockSchema({
      result: mockedOwnerSubjectWithDataAccess,
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

// Required for ActivityAssignDrawer
Element.prototype.scrollTo = jest.fn();

const spyMixpanelTrack = jest.spyOn(Mixpanel, 'track');

/* Test Component
=================================================== */

type UseAssignmentsHookTestProps = {
  activityOrFlow: ParticipantActivityOrFlow;
  targetSubject?: SubjectDetailsWithDataAccess;
  respondentSubject?: SubjectDetailsWithDataAccess;
};

const UseAssignmentsHookTest = ({
  activityOrFlow,
  targetSubject,
  respondentSubject,
}: UseAssignmentsHookTestProps) => {
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
        menuItems={getActionsMenu({ activityOrFlow })}
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
      [GET_APPLET_URL]: successfulGetAppletMock,
      [GET_APPLET_ACTIVITIES_URL]: successfulGetAppletActivitiesMock,
      [GET_WORKSPACE_RESPONDENTS_URL]: ({ userId }) => {
        const respondents = [
          mockedOwnerParticipantWithDataAccess,
          mockedFullParticipant1WithDataAccess,
          mockedLimitedParticipantWithDataAccess,
        ];
        const filteredRespondents = userId
          ? respondents.filter((r) => r.id === userId)
          : respondents;

        return mockSuccessfulHttpResponse<WorkspaceRespondentsResponse>({
          result: filteredRespondents,
          count: filteredRespondents.length,
        });
      },
      [GET_WORKSPACE_MANAGERS_URL]: mockSuccessfulHttpResponse<WorkspaceManagersResponse>({
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
        ${false} | ${Roles.Reviewer}    | ${'editing for Reviewer'}
      `('$description', async ({ canEdit, role }) => {
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

        if (actionDots) {
          await userEvent.click(actionDots);

          if (canEdit) {
            const editButton = screen.getByTestId(`${testId}-edit`);
            expect(editButton).toBeVisible();

            await userEvent.click(editButton);

            expect(mockedUseNavigate).toHaveBeenCalledWith(
              generatePath(page.builderAppletActivity, {
                appletId: mockedAppletId,
                activityId: mockParticipantActivities.autoAssignActivity.id,
              }),
            );
          } else {
            expect(screen.queryByTestId(`${testId}-edit`)).toBeNull();
          }
        } else {
          expect(canEdit).toBe(false);
        }
      });
    });

    test('should hide Edit button in expanded view', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.autoAssignActivity}
          // Expanded view is when both target and respondent subjects are provided
          respondentSubject={mockedOwnerSubject}
          targetSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      expect(screen.queryByTestId(`${testId}-edit`)).toBeNull();
    });

    test('should hide Edit button when an uneditable performance task', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.uneditablePerformanceTask}
          targetSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      expect(screen.queryByTestId(`${testId}-edit`)).toBeNull();
    });

    test('should navigate to appropriate edit URL for flow', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantFlows.autoAssignFlow}
          targetSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      const editButton = screen.getByTestId(`${testId}-edit`);
      expect(editButton).toBeVisible();
      await userEvent.click(editButton);

      expect(mockedUseNavigate).toHaveBeenCalledWith(
        generatePath(page.builderAppletActivityFlowItemAbout, {
          appletId: mockedAppletId,
          activityFlowId: mockParticipantFlows.autoAssignFlow.id,
        }),
      );
    });

    test('should navigate to appropriate edit URL for performance task', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.performanceTask}
          targetSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      const editButton = screen.getByTestId(`${testId}-edit`);
      expect(editButton).toBeVisible();
      await userEvent.click(editButton);

      expect(mockedUseNavigate).toHaveBeenCalledWith(
        generatePath(
          getPerformanceTaskPath(
            mockParticipantActivities.performanceTask
              .performanceTaskType as unknown as EditablePerformanceTasksType,
          ),
          {
            appletId: mockedAppletId,
            activityId: mockParticipantActivities.performanceTask.id,
          },
        ),
      );
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
        await userEvent.click(viewDataButton);

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

        await userEvent.click(viewDataButton);

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

  describe('Export Data', () => {
    test('should hide Export Data if no target subject', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.autoAssignActivity}
          respondentSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      expect(screen.queryByTestId(`${testId}-export`)).toBeNull();
    });

    describe('should show or hide Export Data button depending on role', () => {
      test.each`
        canExportData | role                 | description
        ${true}       | ${Roles.Manager}     | ${'Export Data for Manager'}
        ${true}       | ${Roles.SuperAdmin}  | ${'Export Data for SuperAdmin'}
        ${true}       | ${Roles.Owner}       | ${'Export Data for Owner'}
        ${false}      | ${Roles.Coordinator} | ${'Export Data for Coordinator'}
        ${false}      | ${Roles.Editor}      | ${'Export Data for Editor'}
        ${true}       | ${Roles.Reviewer}    | ${'Export Data for Reviewer'}
      `(
        '$description',
        async ({ canExportData, role }: { canExportData: boolean; role: Roles }) => {
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

          if (actionDots) {
            await userEvent.click(actionDots);
            if (canExportData) {
              expect(screen.getByTestId(`${testId}-export`)).toBeVisible();
            } else {
              expect(screen.queryByTestId(`${testId}-export`)).toBeNull();
            }
          } else {
            expect(canExportData).toBe(false);
          }
        },
      );
    });

    test('should show Export modal', async () => {
      const { rerender } = renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.autoAssignActivity}
          targetSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));
      expect(screen.getByTestId(`${testId}-export`)).toBeVisible();

      const exportDataButton = screen.getByTestId(`${testId}-export`);

      // Attempt to export data without encryption key
      await userEvent.click(exportDataButton);
      expect(screen.queryByTestId(`${testId}-export-modal`)).toBeNull();
      expect(screen.queryByTestId(`${testId}-export-modal-password`)).toBeVisible();

      // Attempt to view data with encryption key
      mockGetAppletPrivateKey.mockReturnValue('mockedPrivateKey');

      rerender(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.autoAssignActivity}
          targetSubject={mockedOwnerSubject}
        />,
      );

      expect(screen.queryByTestId(`${testId}-export-modal-password`)).toBeNull();
      expect(screen.queryByTestId(`${testId}-export-modal`)).toBeVisible();
    });
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
        ${false}     | ${Roles.Reviewer}    | ${'Take Now for Reviewer'}
      `('$description', async ({ canDoTakeNow, role }: { canDoTakeNow: boolean; role: Roles }) => {
        renderWithProviders(
          <UseAssignmentsHookTest
            activityOrFlow={mockParticipantActivities.autoAssignActivity}
            targetSubject={mockedFullSubject1}
          />,
          {
            ...renderOptions,
            preloadedState: { ...renderOptions.preloadedState, ...getPreloadedState(role) },
          },
        );

        const actionDots = screen.queryByTestId(`${testId}-activity-actions-dots`);

        if (actionDots) {
          await userEvent.click(actionDots);

          if (canDoTakeNow) {
            expect(screen.getByTestId(`${testId}-activity-take-now`)).toBeVisible();
          } else {
            expect(screen.queryByTestId(`${testId}-activity-take-now`)).toBeNull();
          }
        } else {
          expect(canDoTakeNow).toBe(false);
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

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      const takeNowButton = screen.getByTestId(`${testId}-activity-take-now`);
      expect(takeNowButton).toBeVisible();
      expect(takeNowButton).toHaveAttribute('aria-disabled', 'true');
    });

    describe('should show Take Now modal prepopulated with', () => {
      test.each`
        roles                       | populated        | description
        ${['respondent']}           | ${[true, false]} | ${'respondent subject'}
        ${['target']}               | ${[false, true]} | ${'target subject'}
        ${['respondent', 'target']} | ${[true, true]}  | ${'both respondent and target subjects'}
      `(
        '$description',
        async ({
          roles,
          populated,
        }: {
          roles: Array<'respondent' | 'target'>;
          populated: [boolean, boolean];
        }) => {
          const props: Partial<UseAssignmentsHookTestProps> = {};
          roles.forEach((role) => (props[`${role}Subject`] = mockedFullSubject1));

          renderWithProviders(
            <UseAssignmentsHookTest
              activityOrFlow={mockParticipantActivities.autoAssignActivity}
              {...props}
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

          const text = `${mockedFullSubject1.secretUserId} (${mockedFullSubject1.nickname}) (${mockedFullSubject1.tag})`;
          expect(sourceSubjectInputElement).toHaveValue(populated[0] ? text : '');
          expect(targetSubjectInputElement).toHaveValue(populated[1] ? text : '');
        },
      );
    });
  });

  describe('Assign', () => {
    describe('should show or hide Assign button depending on role', () => {
      test.each`
        canAssign | role                 | description
        ${true}   | ${Roles.Manager}     | ${'Assign for Manager'}
        ${true}   | ${Roles.SuperAdmin}  | ${'Assign for SuperAdmin'}
        ${true}   | ${Roles.Owner}       | ${'Assign for Owner'}
        ${true}   | ${Roles.Coordinator} | ${'Assign for Coordinator'}
        ${false}  | ${Roles.Editor}      | ${'Assign for Editor'}
        ${false}  | ${Roles.Reviewer}    | ${'Assign for Reviewer'}
      `('$description', async ({ canAssign, role }) => {
        renderWithProviders(
          <UseAssignmentsHookTest
            activityOrFlow={mockParticipantActivities.manualOwnerFullAssignedActivity}
            targetSubject={mockedOwnerSubject}
          />,
          {
            ...renderOptions,
            preloadedState: { ...renderOptions.preloadedState, ...getPreloadedState(role) },
          },
        );

        const actionDots = screen.queryByTestId(`${testId}-activity-actions-dots`);

        if (actionDots) {
          await userEvent.click(actionDots);

          if (canAssign) {
            expect(screen.getByTestId(`${testId}-assign`)).toBeVisible();
          } else {
            expect(screen.queryByTestId(`${testId}-assign`)).toBeNull();
          }
        } else {
          expect(canAssign).toBe(false);
        }
      });
    });

    test('should be hidden for auto-assigned activities', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.autoAssignActivity}
          targetSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      expect(screen.queryByTestId(`${testId}-assign`)).toBeNull();
    });

    test('should be disabled for hidden activities/flows', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantFlows.hiddenFlow}
          targetSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      const assignButton = screen.getByTestId(`${testId}-assign`);
      expect(assignButton).toBeVisible();
      expect(assignButton).toHaveAttribute('aria-disabled', 'true');
    });

    test('should be disabled for limited account respondents', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.manualOwnerLimitedAssignedActivity}
          respondentSubject={mockedLimitedSubject}
        />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      const assignButton = screen.getByTestId(`${testId}-assign`);
      expect(assignButton).toBeVisible();
      expect(assignButton).toHaveAttribute('aria-disabled', 'true');
    });

    test('should be disabled for team account subjects', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.manualOwnerFullAssignedActivity}
          targetSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      const assignButton = screen.getByTestId(`${testId}-assign`);
      expect(assignButton).toBeVisible();
      expect(assignButton).toHaveAttribute('aria-disabled', 'true');
    });

    describe('should show Assign modal prepopulated with', () => {
      test.each`
        roles                       | text                                         | description
        ${['respondent']}           | ${[mockedFullSubject1.secretUserId]}         | ${'respondent subject'}
        ${['target']}               | ${[mockedFullSubject1.secretUserId]}         | ${'target subject'}
        ${['respondent', 'target']} | ${[mockedFullSubject1.secretUserId, 'Self']} | ${'both respondent and target subjects'}
      `(
        '$description',
        async ({ roles, text }: { roles: Array<'respondent' | 'target'>; text: string[] }) => {
          const props: Partial<UseAssignmentsHookTestProps> = {};
          roles.forEach((role) => (props[`${role}Subject`] = mockedFullSubject1));

          renderWithProviders(
            <UseAssignmentsHookTest
              activityOrFlow={mockParticipantActivities.manualOwnerFullAssignedActivity}
              {...props}
            />,
            renderOptions,
          );

          await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

          const assignButton = screen.getByTestId(`${testId}-assign`);
          expect(assignButton).toBeVisible();
          await userEvent.click(assignButton);

          expect(screen.getByTestId('applet-activity-assign')).toBeVisible();

          expect(spyMixpanelTrack).toHaveBeenCalledWith({
            action: MixpanelEventType.StartAssignActivityOrFlow,
            [MixpanelProps.AppletId]: mockedAppletId,
            [MixpanelProps.Via]: 'Participant - Assignments',
            [MixpanelProps.EntityType]: 'activity',
            [MixpanelProps.ActivityId]:
              mockParticipantActivities.manualOwnerFullAssignedActivity.id,
          } as StartAssignActivityOrFlowEvent);

          roles.forEach((role, index) => {
            const subjectCell = screen.getByTestId(
              `applet-activity-assign-assignments-table-0-cell-${role}SubjectId`,
            );
            expect(within(subjectCell).getByText(text[index])).toBeVisible();
          });
        },
      );
    });
  });

  describe('Unassign', () => {
    describe('should show or hide Unassign button depending on role', () => {
      test.each`
        canAssign | role                 | description
        ${true}   | ${Roles.Manager}     | ${'Unassign for Manager'}
        ${true}   | ${Roles.SuperAdmin}  | ${'Unassign for SuperAdmin'}
        ${true}   | ${Roles.Owner}       | ${'Unassign for Owner'}
        ${true}   | ${Roles.Coordinator} | ${'Unassign for Coordinator'}
        ${false}  | ${Roles.Editor}      | ${'Unassign for Editor'}
        ${false}  | ${Roles.Reviewer}    | ${'Unassign for Reviewer'}
      `('$description', async ({ canAssign, role }) => {
        renderWithProviders(
          <UseAssignmentsHookTest
            activityOrFlow={mockParticipantActivities.manualOwnerFullAssignedActivity}
            targetSubject={mockedFullSubject1}
          />,
          {
            ...renderOptions,
            preloadedState: { ...renderOptions.preloadedState, ...getPreloadedState(role) },
          },
        );

        const actionDots = screen.queryByTestId(`${testId}-activity-actions-dots`);

        if (actionDots) {
          await userEvent.click(actionDots);

          if (canAssign) {
            expect(screen.getByTestId(`${testId}-unassign`)).toBeVisible();
          } else {
            expect(screen.queryByTestId(`${testId}-unassign`)).toBeNull();
          }
        } else {
          expect(canAssign).toBe(false);
        }
      });
    });

    test('should be disabled for auto-assigned activities', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.autoAssignActivity}
          targetSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      const assignButton = screen.getByTestId(`${testId}-unassign`);
      expect(assignButton).toBeVisible();
      expect(assignButton).toHaveAttribute('aria-disabled', 'true');
    });

    test('should be hidden for hidden activities/flows', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantFlows.hiddenFlow}
          targetSubject={mockedOwnerSubject}
        />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      expect(screen.queryByTestId(`${testId}-unassign`)).toBeNull();
    });

    test('should be hidden for limited account respondents', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.manualOwnerLimitedAssignedActivity}
          respondentSubject={mockedLimitedSubject}
        />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      expect(screen.queryByTestId(`${testId}-unassign`)).toBeNull();
    });

    test('should be hidden for unassigned activities', async () => {
      renderWithProviders(
        <UseAssignmentsHookTest
          activityOrFlow={mockParticipantActivities.inactiveActivity}
          targetSubject={mockedLimitedSubject}
        />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      expect(screen.queryByTestId(`${testId}-unassign`)).toBeNull();
    });

    test('should show Unassign confirmation modal for single unassignment', async () => {
      const activity = mockParticipantActivities.manualOwnerFullAssignedActivity;
      const { respondentSubject, targetSubject } = activity.assignments[0];

      renderWithProviders(
        <UseAssignmentsHookTest activityOrFlow={activity} respondentSubject={mockedOwnerSubject} />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      const unassignButton = screen.getByTestId(`${testId}-unassign`);
      expect(unassignButton).toBeVisible();
      await userEvent.click(unassignButton);

      const modal = screen.getByTestId('applet-activity-unassign-confirmation-popup');
      expect(modal).toBeVisible();

      expect(spyMixpanelTrack).toHaveBeenCalledWith({
        action: MixpanelEventType.StartUnassignActivityOrFlow,
        [MixpanelProps.AppletId]: mockedAppletId,
        [MixpanelProps.Via]: 'Participant - Assignments',
        [MixpanelProps.EntityType]: 'activity',
        [MixpanelProps.ActivityId]: activity.id,
      } as StartUnassignActivityOrFlowEvent);

      expect(within(modal).getByText(`Unassign ‘${activity.name}’`)).toBeVisible();

      expect(
        within(modal).getByText(`${respondentSubject.firstName} ${respondentSubject.lastName}`),
      ).toBeVisible();
      expect(
        within(modal).getByText(`${targetSubject.secretUserId}, ${targetSubject.nickname}`),
      ).toBeVisible();
    });

    test('should show Unassign drawer for multiple unassignments', async () => {
      const activity = mockParticipantActivities.manualMultipleAssignedActivity;

      renderWithProviders(
        <UseAssignmentsHookTest activityOrFlow={activity} respondentSubject={mockedOwnerSubject} />,
        renderOptions,
      );

      await userEvent.click(screen.getByTestId(`${testId}-activity-actions-dots`));

      const unassignButton = screen.getByTestId(`${testId}-unassign`);
      expect(unassignButton).toBeVisible();
      await userEvent.click(unassignButton);

      const modal = screen.getByTestId('applet-activity-unassign');
      expect(modal).toBeVisible();

      expect(spyMixpanelTrack).toHaveBeenCalledWith({
        action: MixpanelEventType.StartUnassignActivityOrFlow,
        [MixpanelProps.AppletId]: mockedAppletId,
        [MixpanelProps.Via]: 'Participant - Assignments',
        [MixpanelProps.EntityType]: 'activity',
        [MixpanelProps.ActivityId]: activity.id,
      } as StartUnassignActivityOrFlowEvent);

      expect(within(modal).getByText('Unassign Activity')).toBeVisible();

      activity.assignments.forEach((assignment, index) => {
        (['respondentSubject', 'targetSubject'] as const).forEach((key) => {
          const subject = assignment[key];
          const cell = screen.getByTestId(
            `applet-activity-unassign-assignments-table-${index}-cell-${key}`,
          );
          const text =
            subject.tag === 'Team'
              ? `${subject.firstName} ${subject.lastName}`
              : subject.secretUserId;

          expect(within(cell).getByText(text)).toBeVisible();
        });
      });
    });
  });
});
