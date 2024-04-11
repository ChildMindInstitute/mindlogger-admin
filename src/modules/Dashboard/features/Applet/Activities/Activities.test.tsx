import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios, { HttpResponse } from 'jest-mock-axios';
import { generatePath } from 'react-router-dom';

import { ApiResponseCodes } from 'api';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import { mockedAppletData, mockedAppletId, mockedOwnerId } from 'shared/mock';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderWithProviders } from 'shared/utils';
import { mockGetRequestResponses } from 'shared/tests';

import { Activities } from './Activities';

const successfulEmptyGetAppletActivitiesMock: HttpResponse = {
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

const successfulGetAppletActivitiesMock: HttpResponse = {
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

const testId = 'dashboard-applet-activities';
const route = `/dashboard/${mockedAppletId}/activities`;
const routePath = page.appletActivities;

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Dashboard > Applet > Activities screen', () => {
  test('should render empty component', async () => {
    mockGetRequestResponses({
      [`/activities/applet/${mockedAppletId}`]: successfulEmptyGetAppletActivitiesMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
        successfulEmptyHttpResponseMock,
    });

    renderWithProviders(<Activities />, {
      route,
      routePath,
      preloadedState: getPreloadedState(),
    });
    await waitFor(() => {
      expect(screen.getByText('Applet has no activities')).toBeInTheDocument();
    });
  });

  test('should render grid with activity summary cards', async () => {
    const getAppletActivitiesUrl = `/activities/applet/${mockedAppletId}`;

    mockGetRequestResponses({
      [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
        successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, { route, routePath, preloadedState: getPreloadedState() });

    const activities = ['Existing Activity', 'Newly added activity'];

    await waitFor(() => {
      expect(screen.getByTestId(`${testId}-grid`)).toBeInTheDocument();
      expect(mockAxios.get).toHaveBeenCalledWith(getAppletActivitiesUrl, expect.any(Object));
      activities.forEach((activity) => expect(screen.getByText(activity)).toBeInTheDocument());
    });
  });

  test('click Add Activity should navigate to Builder > Applet > Activities', async () => {
    mockGetRequestResponses({
      [`/activities/applet/${mockedAppletId}`]: successfulEmptyGetAppletActivitiesMock,
      [`/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`]:
        successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, { route, routePath, preloadedState: getPreloadedState() });

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
        [`/activities/applet/${mockedAppletId}`]: successfulGetAppletActivitiesMock,
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
});
