// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import * as reactHookForm from 'react-hook-form';

import { page } from 'resources';
import { renderWithProviders } from 'shared/utils';
import { mockedAppletId, mockedRespondentId } from 'shared/mock';

import * as useDatavizSummaryRequestsHook from './hooks/useDatavizSummaryRequests/useDatavizSummaryRequests';
import * as useRespondentAnswersHook from './hooks/useRespondentAnswers/useRespondentAnswers';
import { RespondentDataSummary } from './RespondentDataSummary';

const route = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/summary`;
const routePath = page.appletRespondentDataSummary;
const mockedSetValue = jest.fn();

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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ respondentId: mockedRespondentId, appletId: mockedAppletId }),
}));

jest.mock('./ReportMenu', () => ({
  ReportMenu: () => <div data-testid="report-menu"></div>,
}));

jest.mock('./Report', () => ({
  Report: () => <div data-testid="respondents-summary-report"></div>,
}));

const testEmptyState = (text: string) => {
  expect(screen.getByTestId('report-menu')).toBeInTheDocument();
  expect(screen.getByTestId('summary-empty-state')).toBeInTheDocument();
  expect(screen.getByText(text)).toBeInTheDocument();
};

const emptyStateCases = [
  {
    selectedActivity: null,
    expectedEmptyStateMessage: 'Select the Activity to review the response data.',
    description: 'renders RespondentDataSummary correctly for non-selected activity',
  },
  {
    selectedActivity: {
      id: 'd65e8a64-a023-4830-9c84-7433c4b96440',
      name: 'Activity 1',
      isPerformanceTask: true,
      hasAnswer: true,
    },
    expectedEmptyStateMessage: 'Data visualization for Performance Tasks not supported',
    description: 'renders empty state component if selected activity is performance task',
  },
];

describe('RespondentDataSummary component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(reactHookForm, 'useFormContext').mockReturnValue({ setValue: mockedSetValue });
  });

  test('renders correctly with selected activity and summary activities', async () => {
    jest
      .spyOn(reactHookForm, 'useWatch')
      .mockReturnValue([mockedSelectedActivity, mockedSummaryActivities]);

    renderWithProviders(<RespondentDataSummary />, {
      route,
      routePath,
    });

    expect(screen.getByTestId('report-menu')).toBeInTheDocument();
    expect(screen.getByTestId('respondents-summary-report')).toBeInTheDocument();
  });

  test.each(emptyStateCases)(
    '$description',
    async ({ selectedActivity, expectedEmptyStateMessage }) => {
      jest
        .spyOn(reactHookForm, 'useWatch')
        .mockReturnValue([selectedActivity, mockedSummaryActivities]);
      renderWithProviders(<RespondentDataSummary />, {
        route,
        routePath,
      });

      testEmptyState(expectedEmptyStateMessage);
    },
  );

  test('renders RespondentDataSummary correctly for selected activity with successful data fetching', async () => {
    const mockGetIdentifiersVersions = jest.fn();
    const mockFetchAnswers = jest.fn();
    jest.spyOn(reactHookForm, 'useWatch').mockReturnValue([null, []]);
    jest
      .spyOn(useDatavizSummaryRequestsHook, 'useDatavizSummaryRequests')
      .mockReturnValue({ getIdentifiersVersions: mockGetIdentifiersVersions });
    jest
      .spyOn(useRespondentAnswersHook, 'useRespondentAnswers')
      .mockReturnValue({ fetchAnswers: mockFetchAnswers });

    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: mockedSummaryActivities,
      },
    });

    renderWithProviders(<RespondentDataSummary />, {
      route,
      routePath,
    });

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/summary/activities`,
        {
          params: {
            limit: 10000,
            respondentId: mockedRespondentId,
          },
          signal: undefined,
        },
      );
    });

    expect(mockedSetValue).toHaveBeenCalledWith('summaryActivities', mockedSummaryActivities);
    expect(mockedSetValue).toHaveBeenCalledWith('selectedActivity', mockedSummaryActivities[0]);
    expect(mockGetIdentifiersVersions).toHaveBeenCalledWith({
      activity: mockedSummaryActivities[0],
    });
    expect(mockFetchAnswers).toHaveBeenCalledWith({ activity: mockedSummaryActivities[0] });
  });
});
