import { screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import * as reactHookForm from 'react-hook-form';
import { endOfDay, startOfDay, subDays } from 'date-fns';

import { page } from 'resources';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId, mockedSubjectId1 } from 'shared/mock';
import { MAX_LIMIT } from 'shared/consts';

import * as useDatavizSummaryRequestsHook from './hooks/useDatavizSummaryRequests/useDatavizSummaryRequests';
import * as useRespondentAnswersHook from './hooks/useRespondentAnswers/useRespondentAnswers';
import { InnerRespondentDataSummary } from './RespondentDataSummary';
import { DataSummaryContext } from './DataSummaryContext/DataSummaryContext.context';
import { DataSummaryContextType } from './DataSummaryContext/DataSummaryContext.types';

const route = `/dashboard/${mockedAppletId}/respondents/${mockedSubjectId1}/dataviz/summary`;
const routePath = page.appletRespondentDataSummary;
const mockedSetValue = jest.fn();

const mockedSelectedActivity = {
  id: 'd65e8a64-a023-4830-9c84-7433c4b96440',
  name: 'Activity 1',
  isPerformanceTask: false,
  hasAnswer: true,
  lastAnswerDate: '2023-09-26T12:11:46.162083',
  isFlow: false,
};

const mockedSummaryActivities = [
  { ...mockedSelectedActivity, isFlow: undefined },
  {
    id: '8013d09f-c48d-4aa0-a1e9-1eb3f3061bec',
    name: 'Activity 2',
    isPerformanceTask: false,
    hasAnswer: true,
    lastAnswerDate: '2023-10-27T12:11:46.162083',
  },
];

const mockedSummaryFlows = [
  {
    id: 'flow-id-1',
    name: 'Flow 1',
    hasAnswer: true,
    lastAnswerDate: '2023-10-27T12:11:46.162083',
  },
  {
    id: 'flow-id-2',
    name: 'Flow 2',
    hasAnswer: false,
    lastAnswerDate: null,
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
  useParams: () => ({ respondentId: mockedSubjectId1, appletId: mockedAppletId }),
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
    selectedEntity: null,
    expectedEmptyStateMessage: 'Select the Activity or Activity Flow to review the response data.',
    description: 'renders RespondentDataSummary correctly for non-selected activity',
  },
  {
    selectedEntity: {
      id: 'd65e8a64-a023-4830-9c84-7433c4b96440',
      name: 'Activity 1',
      isPerformanceTask: true,
      lastAnswerDate: '',
      hasAnswer: true,
      isFlow: false,
    },
    expectedEmptyStateMessage: 'Data visualization for Performance Tasks not supported',
    description: 'renders empty state component if selected activity is performance task',
  },
];

const renderComponent = (context: Partial<DataSummaryContextType>) =>
  renderWithProviders(
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    <DataSummaryContext.Provider value={context}>
      <InnerRespondentDataSummary />
    </DataSummaryContext.Provider>,
    {
      route,
      routePath,
    },
  );

describe('RespondentDataSummary component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(reactHookForm, 'useFormContext').mockReturnValue({ setValue: mockedSetValue });
  });

  test('renders correctly with selected activity and summary activities', async () => {
    renderComponent({
      selectedEntity: mockedSelectedActivity,
      summaryActivities: mockedSummaryActivities,
      summaryFlows: [],
    });

    expect(screen.getByTestId('report-menu')).toBeInTheDocument();
    expect(screen.getByTestId('respondents-summary-report')).toBeInTheDocument();
  });

  test.each(emptyStateCases)(
    '$description',
    async ({ selectedEntity, expectedEmptyStateMessage }) => {
      renderComponent({
        selectedEntity,
        summaryActivities: mockedSummaryActivities,
        summaryFlows: mockedSummaryFlows,
      });

      testEmptyState(expectedEmptyStateMessage);
    },
  );

  test('renders RespondentDataSummary correctly for selected activity with successful data fetching', async () => {
    const mockGetIdentifiersVersions = jest.fn();
    const mockFetchAnswers = jest.fn();
    const mockedSetSummaryActivities = jest.fn();
    const mockedSetSummaryFlows = jest.fn();
    const mockedSetSelectedEntity = jest.fn();
    jest
      .spyOn(useDatavizSummaryRequestsHook, 'useDatavizSummaryRequests')
      .mockReturnValue({ getIdentifiersVersions: mockGetIdentifiersVersions });
    jest
      .spyOn(useRespondentAnswersHook, 'useRespondentAnswers')
      .mockReturnValue({ fetchAnswers: mockFetchAnswers });

    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: mockedSummaryFlows,
      },
    });
    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: mockedSummaryActivities,
      },
    });

    renderComponent({
      selectedEntity: null,
      summaryActivities: [],
      summaryFlows: [],
      setSummaryActivities: mockedSetSummaryActivities,
      setSummaryFlows: mockedSetSummaryFlows,
      setSelectedEntity: mockedSetSelectedEntity,
    });

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/summary/flows`,
        {
          params: {
            limit: MAX_LIMIT,
            targetSubjectId: mockedSubjectId1,
          },
          signal: undefined,
        },
      );
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        2,
        `/answers/applet/${mockedAppletId}/summary/activities`,
        {
          params: {
            limit: MAX_LIMIT,
            targetSubjectId: mockedSubjectId1,
          },
          signal: undefined,
        },
      );
    });

    //set activities and flows
    expect(mockedSetSummaryFlows).toHaveBeenCalledWith(mockedSummaryFlows);
    expect(mockedSetSummaryActivities).toHaveBeenCalledWith(mockedSummaryActivities);

    //select activity with the last answer date
    const selectedActivity = {
      ...mockedSummaryActivities[1],
      isFlow: false,
    };
    expect(mockedSetSelectedEntity).toHaveBeenCalledWith(selectedActivity);

    //set startDate end endDate to 1 week from the most recent response
    const expectedEndDate = endOfDay(new Date('2023-10-27'));
    const expectedStartDate = startOfDay(subDays(expectedEndDate, 6));
    expect(mockedSetValue).toHaveBeenCalledWith('startDate', expectedStartDate);
    expect(mockedSetValue).toHaveBeenCalledWith('endDate', expectedEndDate);

    expect(mockGetIdentifiersVersions).toHaveBeenCalledWith({
      entity: selectedActivity,
    });
    expect(mockFetchAnswers).toHaveBeenCalledWith({ entity: selectedActivity });
  });
});
