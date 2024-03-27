import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import { generatePath } from 'react-router-dom';

import { renderWithProviders } from 'shared/utils';
import { mockedAppletData, mockedAppletId } from 'shared/mock';
import { ApiResponseCodes } from 'api';
import { page } from 'resources';

import { Activities } from './Activities';

const successfulEmptyGetMock = {
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
        `/activities/applet/${mockedAppletId}`,
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
});
