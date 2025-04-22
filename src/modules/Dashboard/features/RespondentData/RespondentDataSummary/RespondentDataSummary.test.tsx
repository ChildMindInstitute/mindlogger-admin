import { screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import * as reactHookForm from 'react-hook-form';
import { endOfDay, startOfDay, subDays } from 'date-fns';

import { page } from 'resources';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId, mockedFullSubjectId1 } from 'shared/mock';
import { MAX_LIMIT } from 'shared/consts';

import * as useDatavizSummaryRequestsHook from './hooks/useDatavizSummaryRequests/useDatavizSummaryRequests';
import * as useRespondentAnswersHook from './hooks/useRespondentAnswers/useRespondentAnswers';
import { RespondentDataSummary } from './RespondentDataSummary';
import { RespondentDataContext } from '../RespondentDataContext/RespondentDataContext.context';
import { RespondentDataContextType } from '../RespondentDataContext/RespondentDataContext.types';

const route = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/dataviz/summary`;
const routePath = page.appletParticipantDataSummary;
const mockedSetValue = vi.fn();

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
const mockedSetSelectedEntity = vi.fn();

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

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => ({ subjectId: mockedFullSubjectId1, appletId: mockedAppletId }),
  };
});

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

const renderComponent = (context: Partial<RespondentDataContextType>) =>
  renderWithProviders(
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    <RespondentDataContext.Provider value={context}>
      <RespondentDataSummary />
    </RespondentDataContext.Provider>,
    {
      route,
      routePath,
    },
  );

describe('RespondentDataSummary component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    vi.spyOn(reactHookForm, 'useFormContext').mockReturnValue({ setValue: mockedSetValue });
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
        setSelectedEntity: mockedSetSelectedEntity,
      });

      testEmptyState(expectedEmptyStateMessage);
    },
  );

  test('should fetch activities and flows', async () => {
    const mockedSetSummaryActivities = vi.fn();
    const mockedSetSummaryFlows = vi.fn();

    vi.mocked(axios.get).mockResolvedValueOnce({
      data: {
        result: mockedSummaryFlows,
      },
    });
    vi.mocked(axios.get).mockResolvedValueOnce({
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
      expect(axios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/summary/flows`,
        {
          params: {
            limit: MAX_LIMIT,
            targetSubjectId: mockedFullSubjectId1,
          },
          signal: undefined,
        },
      );
      expect(axios.get).toHaveBeenNthCalledWith(
        2,
        `/answers/applet/${mockedAppletId}/summary/activities`,
        {
          params: {
            limit: MAX_LIMIT,
            targetSubjectId: mockedFullSubjectId1,
          },
          signal: undefined,
        },
      );
    });

    //set activities and flows
    expect(mockedSetSummaryFlows).toHaveBeenCalledWith(mockedSummaryFlows);
    expect(mockedSetSummaryActivities).toHaveBeenCalledWith(mockedSummaryActivities);
  });

  test('should choose the activity or flow with latest answers and fetch answers for it', async () => {
    const mockGetIdentifiersVersions = vi.fn();
    const mockFetchAnswers = vi.fn();
    vi.spyOn(useDatavizSummaryRequestsHook, 'useDatavizSummaryRequests').mockReturnValue({
      getIdentifiersVersions: mockGetIdentifiersVersions,
    });
    vi.spyOn(useRespondentAnswersHook, 'useRespondentAnswers').mockReturnValue({
      fetchAnswers: mockFetchAnswers,
    });

    renderComponent({
      selectedEntity: null,
      summaryActivities: mockedSummaryActivities,
      summaryFlows: mockedSummaryFlows,
      setSelectedEntity: mockedSetSelectedEntity,
    });

    //select entity with the last answer date
    const selectedEntity = {
      ...mockedSummaryFlows[0],
      isFlow: true,
    };
    expect(mockedSetSelectedEntity).toHaveBeenCalledWith(selectedEntity);

    //set startDate end endDate to 1 week from the most recent response
    const expectedEndDate = endOfDay(new Date('2023-10-27'));
    const expectedStartDate = startOfDay(subDays(expectedEndDate, 6));
    expect(mockedSetValue).toHaveBeenCalledWith('startDate', expectedStartDate);
    expect(mockedSetValue).toHaveBeenCalledWith('endDate', expectedEndDate);

    await waitFor(() => {
      expect(mockGetIdentifiersVersions).toHaveBeenCalledWith({
        entity: selectedEntity,
      });
      expect(mockFetchAnswers).toHaveBeenCalledWith({ entity: selectedEntity });
    });
  });
});
