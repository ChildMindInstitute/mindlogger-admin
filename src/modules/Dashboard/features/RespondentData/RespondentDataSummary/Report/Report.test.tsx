import { screen } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import * as reactHookForm from 'react-hook-form';

import { page } from 'resources';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet, mockedAppletId, mockedSubjectId1 } from 'shared/mock';
import { initialStateData } from 'redux/modules';

import { Report } from './Report';

const preloadedState = {
  applet: {
    applet: {
      ...initialStateData,
      data: {
        result: {
          ...mockedApplet,
          reportServerIp: 'reportServerIp',
          reportPublicKey: 'reportPublicKey',
          activities: [
            {
              name: 'Activity 1',
              scoresAndReports: {
                generateReport: true,
              },
              id: 'd65e8a64-a023-4830-9c84-7433c4b96440',
            },
          ],
        },
      },
    },
  },
};

const route = `/dashboard/${mockedAppletId}/respondents/${mockedSubjectId1}/dataviz/summary`;
const routePath = page.appletRespondentDataSummary;

const mockedActivity = {
  id: 'd65e8a64-a023-4830-9c84-7433c4b96440',
  name: 'Activity 1',
  isPerformanceTask: false,
  hasAnswer: true,
  isFlow: false,
};
const mockedAnswers = [
  {
    answerId: 'answer-id',
    decryptedAnswer: [
      {
        activityItem: {
          question: {
            en: 'Single Selected - Mocked Item',
          },
          responseType: 'singleSelect',
          responseValues: {
            options: [
              {
                id: '484596cc-0b4e-42a9-ab9d-20d4dae97d58',
                text: '1',
                isHidden: false,
                value: 0,
              },
              {
                id: 'a6ee9b74-e1d3-47b2-8c7f-fa9a22313b19',
                text: '2',
                isHidden: false,
                value: 1,
              },
            ],
          },
          config: {
            removeBackButton: false,
            skippableItem: true,
            randomizeOptions: false,
            timer: 0,
            addScores: false,
            setAlerts: false,
            addTooltip: false,
            setPalette: false,
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
          },
          name: 'ss-1',
          isHidden: false,
          allowEdit: true,
          id: 'ab383cc6-834b-45da-a0e1-fc21ca74b316',
          order: 1,
        },
        answer: {
          value: '0',
          edited: null,
        },
        items: [],
      },
    ],
    endDatetime: '2024-03-18T15:13:27.485000',
    events: '',
    startDatetime: '2024-03-18T15:09:46.258000',
    subscaleSetting: null,
    version: '2.2.0',
  },
];
const mockedResponseOptions = {
  option1id: [
    {
      activityItem: mockedActivity,
      answers: [
        {
          answer: {
            value: 1,
            text: null,
          },
          date: '2024-03-18T15:13:27.485000',
        },
        {
          answer: {
            value: 3,
            text: null,
          },
          date: '2024-03-18T15:13:53.398000',
        },
      ],
    },
  ],
};

jest.mock('./ReportFilters', () => ({
  ReportFilters: () => <div data-testid="report-filters"></div>,
}));

jest.mock('./CompletedChart', () => ({
  CompletedChart: () => <div data-testid="report-activity-completed"></div>,
}));

jest.mock('./Subscales', () => ({
  Subscales: () => <div data-testid="report-subscales"></div>,
}));

jest.mock('./ResponseOptions', () => ({
  ResponseOptions: () => <div data-testid="report-response-options"></div>,
}));

jest.mock('downloadjs', () => jest.fn());

const renderComponent = () =>
  renderWithProviders(<Report />, {
    route,
    routePath,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    preloadedState,
  });

describe('Report component', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(reactHookForm, 'useFormContext').mockReturnValue({ setValue: jest.fn() });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders Report correctly with data', async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: 'data',
    });
    jest
      .spyOn(reactHookForm, 'useWatch')
      .mockReturnValue([
        mockedAnswers,
        mockedResponseOptions,
        0,
        mockedActivity,
        [],
        [],
        ['v1', 'v2'],
        [],
        [],
      ]);

    renderComponent();

    expect(screen.getByTestId('respondents-summary-report')).toBeInTheDocument();
    expect(screen.getByText('Activity 1')).toBeInTheDocument();
    const downloadReportButton = screen.getByTestId(
      'respondents-summary-report-header-download-report',
    );
    expect(screen.getByText('Download Latest Report')).toBeInTheDocument();
    expect(downloadReportButton).toBeInTheDocument();
    expect(screen.getByTestId('report-filters')).toBeInTheDocument();
    expect(screen.getByTestId('report-activity-completed')).toBeInTheDocument();
    expect(screen.getByTestId('report-response-options')).toBeInTheDocument();
  });

  test('renders Report correctly with no data', async () => {
    jest
      .spyOn(reactHookForm, 'useWatch')
      .mockReturnValue([[], {}, 0, mockedActivity, [], [], ['v1', 'v2'], [], []]);
    renderComponent();

    expect(screen.getByTestId('report-empty-state')).toBeInTheDocument();
    expect(screen.getByText('No match was found. Try to adjust filters.')).toBeInTheDocument();
  });

  test('renders Report correctly with empty version filter', async () => {
    jest
      .spyOn(reactHookForm, 'useWatch')
      .mockReturnValue([[], {}, 0, mockedActivity, [], [], [], [], []]);
    renderComponent();

    expect(screen.getByTestId('report-with-empty-version-filter')).toBeInTheDocument();
    expect(screen.getByText('Select a Version to view the response data.')).toBeInTheDocument();
  });

  test('renders Report correctly with no answers', async () => {
    const activityMocked = {
      ...mockedActivity,
      hasAnswer: false,
    };
    jest.spyOn(reactHookForm, 'useWatch').mockReturnValue([[], {}, 0, activityMocked, [], [], []]);
    renderComponent();

    expect(screen.getByTestId('summary-empty-state')).toBeInTheDocument();
    expect(screen.getByText('No available Data yet')).toBeInTheDocument();
  });
});
