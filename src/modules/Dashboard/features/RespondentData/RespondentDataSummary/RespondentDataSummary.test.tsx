// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { ApiResponseCodes } from 'api';
import { RespondentDataContext } from 'modules/Dashboard/pages/RespondentData/RespondentData.context';
import { page } from 'resources';
import { mockedAppletId, mockedIdentifiers, mockedRespondentId } from 'shared/mock';
import { renderWithProviders } from 'shared/utils';

import { RespondentDataSummary } from './RespondentDataSummary';

const route = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/summary`;
const routePath = page.appletRespondentDataSummary;

const mockedSelectedActivity = {
  id: 'd65e8a64-a023-4830-9c84-7433c4b96440',
  name: 'Activity 1',
  isPerformanceTask: false,
  hasAnswer: true,
};

const mockedSummaryActivities = [
  mockedSelectedActivity,
  {
    id: '8013d09f-c48d-4aa0-a1e9-1eb3f3061bec',
    name: 'Activity 2',
    isPerformanceTask: false,
    hasAnswer: true,
  },
];

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    setValue: jest.fn(),
  }),
}));

jest.mock('modules/Dashboard/hooks', () => ({
  ...jest.requireActual('modules/Dashboard/hooks'),
  useDecryptedIdentifiers: () => () => [
    {
      encryptedValue: 'jane doe',
      decryptedValue: 'decryptedValue1',
    },
    {
      encryptedValue: 'sam carter',
      decryptedValue: 'decryptedValue2',
    },
  ],
}));

jest.mock('./ReportMenu', () => ({
  ReportMenu: () => <div data-testid="report-menu"></div>,
}));

jest.mock('./Report', () => ({
  Report: () => <div data-testid="respondents-summary-report"></div>,
}));

const getRespondentDataSummaryComponent = ({ summaryActivities = mockedSummaryActivities, selectedActivity }) => (
  <RespondentDataContext.Provider
    value={{
      summaryActivities,
      setSummaryActivities: jest.fn,
      selectedActivity,
      setSelectedActivity: jest.fn,
    }}
  >
    <RespondentDataSummary />
  </RespondentDataContext.Provider>
);

describe('RespondentDataSummary component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders RespondentDataSummary correctly for non-selected activity', async () => {
    renderWithProviders(
      getRespondentDataSummaryComponent({
        selectedActivity: undefined,
      }),
      {
        route,
        routePath,
      },
    );

    expect(screen.getByTestId('report-menu')).toBeInTheDocument();
    expect(screen.getByTestId('summary-empty-state')).toBeInTheDocument();
    expect(screen.getByText(/Select the Activity to review the response data./)).toBeInTheDocument();
  });

  test('renders RespondentDataSummary correctly for selected activity with successful data fetching', async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: mockedIdentifiers,
      },
    });

    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: [
          {
            version: '2.0.0',
            createdAt: '2024-01-13T11:07:45.837338',
          },
          {
            version: '2.0.1',
            createdAt: '2024-01-16T20:47:45.837338',
          },
        ],
      },
    });

    renderWithProviders(
      getRespondentDataSummaryComponent({
        selectedActivity: mockedSelectedActivity,
      }),
      {
        route,
        routePath,
      },
    );

    expect(screen.getByTestId('report-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('summary-empty-state')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/summary/activities/${mockedSelectedActivity.id}/identifiers`,
        {
          params: {
            respondentId: mockedRespondentId,
          },
          signal: undefined,
        },
      );

      expect(mockAxios.get).toHaveBeenNthCalledWith(
        2,
        `/answers/applet/${mockedAppletId}/summary/activities/${mockedSelectedActivity.id}/versions`,
        {
          signal: undefined,
        },
      );
    });

    expect(screen.getByTestId('respondents-summary-report')).toBeInTheDocument();
  });

  test('renders RespondentDataSummary correctly for selected activity with unsuccessful data fetching', async () => {
    mockAxios.get.mockResolvedValueOnce({
      status: ApiResponseCodes.BadRequest,
    });

    renderWithProviders(
      getRespondentDataSummaryComponent({
        selectedActivity: mockedSelectedActivity,
      }),
      {
        route,
        routePath,
      },
    );

    expect(screen.getByTestId('report-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('summary-empty-state')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/summary/activities/${mockedSelectedActivity.id}/identifiers`,
        {
          params: {
            respondentId: mockedRespondentId,
          },
          signal: undefined,
        },
      );
    });

    expect(screen.queryByTestId('respondents-summary-report')).not.toBeInTheDocument();
  });
});
