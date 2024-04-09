import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';
import { generatePath } from 'react-router-dom';

import { ApiResponseCodes } from 'api';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import { mockedAppletSummaryData, mockedAppletId, mockedUserData } from 'shared/mock';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderWithProviders } from 'shared/utils';

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

const testId = 'dashboard-applet-participant-activities';
const route = `/dashboard/${mockedAppletId}/participants/${mockedUserData.id}`;
const routePath = page.appletParticipantActivities;

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Dashboard > Applet > Participant > Activities screen', () => {
  test('should render empty component', async () => {
    mockAxios.get.mockResolvedValue(successfulEmptyGetMock);
    renderWithProviders(<Activities />, { route, routePath });

    await waitFor(() => {
      expect(screen.getByText('Applet has no activities')).toBeInTheDocument();
    });
  });

  test('should render grid with activity summary cards', async () => {
    mockAxios.get.mockResolvedValueOnce(successfulGetAppletActivitiesMock);
    renderWithProviders(<Activities />, { route, routePath });

    const activities = ['Existing Activity', 'Newly added activity'];

    await waitFor(() => {
      expect(screen.getByTestId(`${testId}-grid`)).toBeInTheDocument();
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/summary/activities`,
        expect.any(Object),
      );
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
});
