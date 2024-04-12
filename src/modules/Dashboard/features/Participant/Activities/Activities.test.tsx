import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios, { HttpResponse } from 'jest-mock-axios';
import { generatePath } from 'react-router-dom';
import { PreloadedState } from '@reduxjs/toolkit';

import { ApiResponseCodes } from 'api';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import {
  mockedAppletId,
  mockedAppletSummaryData,
  mockedOwnerId,
  mockedRespondent,
  mockedRespondent2,
  mockedUserData,
} from 'shared/mock';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import {
  mockGetRequestResponses,
  mockSchema,
  mockSuccessfulHttpResponse,
  renderWithProviders,
} from 'shared/utils';
import { RootState } from 'redux/store';
import { useLaunchDarkly } from 'shared/hooks/useLaunchDarkly';
import { ParticipantsData } from 'modules/Dashboard/features/Participants';

import { Activities } from './Activities';

const successfulEmptyGetMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [],
  },
};

const successfulGetAppletActivitiesMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: mockedAppletSummaryData,
  },
};

const successfulEmptyHttpResponseMock: HttpResponse = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [],
  },
};

const testId = 'dashboard-applet-participant-activities';
const route = `/dashboard/${mockedAppletId}/participants/${mockedUserData.id}`;
const routePath = page.appletParticipantActivities;

const preloadedState: PreloadedState<RootState> = {
  ...getPreloadedState(),
  users: {
    respondentDetails: mockSchema({
      result: {
        secretUserId: 'secretUserId',
        nickname: 'nickname',
        lastSeen: null,
      },
    }),
    allRespondents: mockSchema(null),
    subjectDetails: mockSchema(null),
  },
};

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

jest.mock('shared/hooks/useLaunchDarkly', () => ({
  useLaunchDarkly: jest.fn(),
}));

const mockUseLaunchDarkly = useLaunchDarkly as jest.Mock;

describe('Dashboard > Applet > Participant > Activities screen', () => {
  beforeEach(() => {
    mockUseLaunchDarkly.mockReturnValue({
      flags: {
        enableMultiInformant: true,
        enableMultiInformantTakeNow: true,
      },
    });
  });

  test('should render empty component', async () => {
    mockAxios.get.mockResolvedValue(successfulEmptyGetMock);
    renderWithProviders(<Activities />, { route, routePath, preloadedState });

    await waitFor(() => {
      expect(screen.getByText('Applet has no activities')).toBeInTheDocument();
    });
  });

  test('should render grid with activity summary cards', async () => {
    const getAppletActivitiesUrl = `/answers/applet/${mockedAppletId}/summary/activities`;
    mockGetRequestResponses({
      [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
        successfulEmptyHttpResponseMock,
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
    mockAxios.get.mockResolvedValue(successfulEmptyGetMock);
    renderWithProviders(<Activities />, { route, routePath });

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
      mockAxios.get.mockResolvedValue(successfulGetAppletActivitiesMock);
      renderWithProviders(<Activities />, {
        preloadedState: getPreloadedState(role),
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
            activityId: mockedAppletSummaryData[0].id,
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
        ${true}      | ${Roles.Coordinator} | ${'Take Now for Coordinator'}
        ${false}     | ${Roles.Editor}      | ${'Take Now for Editor'}
        ${false}     | ${Roles.Respondent}  | ${'Take Now for Respondent'}
        ${false}     | ${Roles.Reviewer}    | ${'Take Now for Reviewer'}
      `('$description', async ({ canDoTakeNow, role }: { canDoTakeNow: boolean; role: Roles }) => {
        mockGetRequestResponses({
          [`/answers/applet/${mockedAppletId}/summary/activities`]:
            successfulGetAppletActivitiesMock,
          [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
            successfulEmptyHttpResponseMock,
        });
        renderWithProviders(<Activities />, {
          preloadedState: getPreloadedState(role),
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
          [`/answers/applet/${mockedAppletId}/summary/activities`]:
            successfulGetAppletActivitiesMock,
          [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
            successfulEmptyHttpResponseMock,
        });

        mockUseLaunchDarkly.mockReturnValue({
          flags: {
            enableMultiInformant: true,
            enableMultiInformantTakeNow: false,
          },
        });

        renderWithProviders(<Activities />, {
          preloadedState: getPreloadedState(role),
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
        [`/answers/applet/${mockedAppletId}/summary/activities`]: successfulGetAppletActivitiesMock,
        [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
          successfulGetAppletParticipantsMock,
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

      const { secretUserId, nickname } =
        preloadedState?.users?.respondentDetails.data?.result ?? {};

      expect(subjectInputElement).toHaveValue(`${secretUserId} (${nickname})`);

      expect(participantInputElement).toHaveValue(
        `${mockedUserData.id} (${mockedUserData.firstName} ${mockedUserData.lastName[0]}.)`,
      );
    });
  });
});
