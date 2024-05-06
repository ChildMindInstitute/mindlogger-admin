import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios, { HttpResponse } from 'jest-mock-axios';
import { generatePath } from 'react-router-dom';
import { PreloadedState } from '@reduxjs/toolkit';

import { ApiResponseCodes } from 'api';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import {
  mockedAppletData,
  mockedAppletId,
  mockedOwnerId,
  mockedRespondent,
  mockedRespondent2,
  mockedUserData,
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

import { Activities } from './Activities';

const successfulEmptyGetAppletActivitiesMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: {
      activitiesDetails: [],
      appletDetail: {
        ...mockedAppletData,
        activities: [],
      },
    },
  },
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

const successfulEmptyHttpResponseMock: HttpResponse = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [],
  },
};

const getAppletActivitiesUrl = `/activities/applet/${mockedAppletId}`;
const getWorkspaceRespondentsUrl = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`;

const testId = 'dashboard-applet-participant-activities';
const route = `/dashboard/${mockedAppletId}/participants/${mockedUserData.id}`;
const routePath = page.appletParticipantActivities;

const preloadedState: PreloadedState<RootState> = {
  ...getPreloadedState(),
  users: {
    respondentDetails: mockSchema(null),
    allRespondents: mockSchema(null),
    subjectDetails: mockSchema({
      result: {
        id: 'test-id',
        secretUserId: 'secretUserId',
        nickname: 'nickname',
        lastSeen: null,
      },
    }),
  },
};

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));

const mockUseFeatureFlags = useFeatureFlags as jest.Mock;

describe('Dashboard > Applet > Participant > Activities screen', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableMultiInformant: true,
        enableMultiInformantTakeNow: true,
      },
    });
  });

  test('should render empty component', async () => {
    mockGetRequestResponses({
      [getAppletActivitiesUrl]: successfulEmptyGetAppletActivitiesMock,
      [getWorkspaceRespondentsUrl]: successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, { route, routePath, preloadedState });

    await waitFor(() => {
      expect(screen.getByText('Applet has no activities')).toBeInTheDocument();
    });
  });

  test('should render grid with activity summary cards', async () => {
    mockGetRequestResponses({
      [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
      [getWorkspaceRespondentsUrl]: successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, { route, routePath, preloadedState });

    const activities = ['Existing Activity', 'Newly added activity'];

    await waitFor(() => {
      expect(screen.getByTestId(`${testId}-grid`)).toBeInTheDocument();
      expect(mockAxios.get).toHaveBeenCalledWith(getAppletActivitiesUrl, expect.any(Object));
      activities.forEach((activity) => expect(screen.getByText(activity)).toBeInTheDocument());
    });
  });

  test('click Add Activity should navigate to Builder > Applet > Activities', async () => {
    mockGetRequestResponses({
      [getAppletActivitiesUrl]: successfulEmptyGetAppletActivitiesMock,
      [getWorkspaceRespondentsUrl]: successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, { route, routePath, preloadedState });

    fireEvent.click(screen.getByTestId(`${testId}-add-activity`));

    expect(mockedUseNavigate).toHaveBeenCalledWith(
      generatePath(page.builderAppletActivities, { appletId: mockedAppletId }),
    );
  });

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
      mockGetRequestResponses({
        [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
        [getWorkspaceRespondentsUrl]: successfulEmptyHttpResponseMock,
      });
      renderWithProviders(<Activities />, {
        preloadedState: { ...preloadedState, ...getPreloadedState(role) },
        route,
        routePath,
      });

      await waitFor(() =>
        expect(screen.getAllByTestId(`${testId}-activity-actions-dots`)[0]).toBeVisible(),
      );
      userEvent.click(screen.getAllByTestId(`${testId}-activity-actions-dots`)[0]);

      if (canEdit) {
        await waitFor(() => expect(screen.getByTestId(`${testId}-activity-edit`)).toBeVisible());

        fireEvent.click(screen.getByTestId(`${testId}-activity-edit`));
        expect(mockedUseNavigate).toHaveBeenCalledWith(
          generatePath(page.builderAppletActivity, {
            appletId: mockedAppletId,
            activityId: mockedAppletData.activities[0].id,
          }),
        );
      } else {
        await waitFor(() => expect(screen.queryByTestId(`${testId}-activity-edit`)).toBe(null));
      }
    });
  });

  describe('Take Now modal', () => {
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
        mockGetRequestResponses({
          [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
          [getWorkspaceRespondentsUrl]: successfulEmptyHttpResponseMock,
        });
        renderWithProviders(<Activities />, {
          preloadedState: { ...preloadedState, ...getPreloadedState(role) },
          route,
          routePath,
        });

        await waitFor(() =>
          expect(screen.getAllByTestId(`${testId}-activity-actions-dots`)[0]).toBeVisible(),
        );
        userEvent.click(screen.getAllByTestId(`${testId}-activity-actions-dots`)[0]);

        if (canDoTakeNow) {
          await waitFor(() =>
            expect(screen.getByTestId(`${testId}-activity-take-now`)).toBeVisible(),
          );
        } else {
          await waitFor(() =>
            expect(screen.queryByTestId(`${testId}-activity-take-now`)).toBe(null),
          );
        }
      });
    });

    describe('Should hide Take now button for everyone if feature flag is off', () => {
      test.each`
        role                 | description
        ${Roles.Manager}     | ${'Take Now for Manager'}
        ${Roles.SuperAdmin}  | ${'Take Now for SuperAdmin'}
        ${Roles.Owner}       | ${'Take Now for Owner'}
        ${Roles.Coordinator} | ${'Take Now for Coordinator'}
        ${Roles.Editor}      | ${'Take Now for Editor'}
        ${Roles.Respondent}  | ${'Take Now for Respondent'}
        ${Roles.Reviewer}    | ${'Take Now for Reviewer'}
      `('$description', async ({ role }: { role: Roles }) => {
        mockGetRequestResponses({
          [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
          [getWorkspaceRespondentsUrl]: successfulEmptyHttpResponseMock,
        });

        mockUseFeatureFlags.mockReturnValue({
          featureFlags: {
            enableMultiInformant: true,
            enableMultiInformantTakeNow: false,
          },
        });

        renderWithProviders(<Activities />, {
          preloadedState: { ...preloadedState, ...getPreloadedState(role) },
          route,
          routePath,
        });

        await waitFor(() =>
          expect(screen.getAllByTestId(`${testId}-activity-actions-dots`)[0]).toBeVisible(),
        );
        await userEvent.click(screen.getAllByTestId(`${testId}-activity-actions-dots`)[0]);

        await waitFor(() => expect(screen.queryByTestId(`${testId}-activity-take-now`)).toBe(null));
      });
    });

    test('should pre-populate admin and participant in Take Now modal', async () => {
      const successfulGetAppletParticipantsMock = mockSuccessfulHttpResponse<ParticipantsData>({
        result: [mockedRespondent, mockedRespondent2],
        count: 0,
      });

      mockGetRequestResponses({
        [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
        [getWorkspaceRespondentsUrl]: successfulGetAppletParticipantsMock,
      });

      renderWithProviders(<Activities />, {
        preloadedState: {
          ...preloadedState,
          auth: {
            authentication: mockSchema({
              user: mockedUserData,
            }),
            isAuthorized: true,
            isLogoutInProgress: false,
          },
        },
        route,
        routePath,
      });

      await waitFor(() =>
        expect(screen.getAllByTestId(`${testId}-activity-actions-dots`)[0]).toBeVisible(),
      );

      await userEvent.click(screen.getAllByTestId(`${testId}-activity-actions-dots`)[0]);

      await waitFor(() => expect(screen.getByTestId(`${testId}-activity-take-now`)).toBeVisible());

      fireEvent.click(screen.getByTestId(`${testId}-activity-take-now`));

      const modal = screen.getByTestId(`${testId}-take-now-modal`);

      await waitFor(() => expect(modal).toBeVisible());

      const subjectInputElement = screen
        .getByTestId(`${testId}-take-now-modal-subject-dropdown`)
        .querySelector('input');

      const participantInputElement = screen
        .getByTestId(`${testId}-take-now-modal-participant-dropdown`)
        .querySelector('input');

      const { secretUserId, nickname } = preloadedState?.users?.subjectDetails.data?.result ?? {};

      expect(subjectInputElement).toHaveValue(`${secretUserId} (${nickname})`);

      expect(participantInputElement).toHaveValue(
        `${mockedUserData.id} (${mockedUserData.firstName} ${mockedUserData.lastName})`,
      );
    });
  });
});
