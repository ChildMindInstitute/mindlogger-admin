// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';
import download from 'downloadjs';

import { page } from 'resources';
import { renderWithProviders } from 'shared/utils';
import { mockedApplet, mockedAppletId, mockedRespondentId } from 'shared/mock';
import { initialStateData } from 'redux/modules';
import * as dashboardHooks from 'modules/Dashboard/hooks';

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

const route = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/summary`;
const routePath = page.appletRespondentDataSummary;

const mockedActivity = {
  id: 'd65e8a64-a023-4830-9c84-7433c4b96440',
  name: 'Activity 1',
  isPerformanceTask: false,
  hasAnswer: true,
};

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useWatch: jest.fn(),
  useFormContext: () => ({
    getValues: () => ({
      startDate: new Date('2024-01-17T15:27:08.736Z'),
      endDate: new Date('2024-01-23T15:27:08.736Z'),
      startTime: '00:00',
      endTime: '23:59',
      filterByIdentifier: false,
      identifier: [],
      versions: [
        {
          id: '2.0.0',
          label: '2.0.0',
        },
        {
          id: '2.0.1',
          label: '2.0.1',
        },
      ],
    }),
  }),
}));

jest.mock('modules/Dashboard/hooks', () => ({
  ...jest.requireActual('modules/Dashboard/hooks'),
  useDecryptedActivityData: jest.fn(),
}));

jest.mock('./ReportFilters', () => ({
  ReportFilters: () => <div data-testid="report-filters"></div>,
}));

jest.mock('./ActivityCompleted', () => ({
  ActivityCompleted: () => <div data-testid="report-activity-completed"></div>,
}));

jest.mock('./Subscales', () => ({
  Subscales: () => <div data-testid="report-subscales"></div>,
}));

jest.mock('./ResponseOptions', () => ({
  ResponseOptions: () => <div data-testid="report-response-options"></div>,
}));

jest.mock('downloadjs', () => jest.fn());

describe('Report component', () => {
  test('renders Report correctly with data', async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: [
          {
            userPublicKey: 'userPublicKey',
            answer: 'answer',
            items: [],
            itemIds: 'itemIds',
          },
        ],
      },
    });

    mockAxios.post.mockResolvedValueOnce({
      data: 'data',
    });

    const getDecryptedActivityDataMock = jest.fn().mockReturnValue({
      decryptedAnswers: [
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
          items: [
            {
              question: {
                en: 'Single Selected - Mocked Item',
              },
              responseType: 'singleSelect',
              responseValues: {
                paletteName: null,
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
          ],
        },
      ],
    });

    dashboardHooks.useDecryptedActivityData.mockReturnValue(getDecryptedActivityDataMock);

    const { rerender } = renderWithProviders(
      <Report activity={mockedActivity} identifiers={[]} versions={[]} />,
      {
        route,
        routePath,
        preloadedState,
      },
    );

    expect(screen.getByTestId('respondents-summary-report')).toBeInTheDocument();
    expect(screen.getByText('Activity 1')).toBeInTheDocument();
    const downloadReportButton = screen.getByTestId('respondents-summary-download-report');
    expect(screen.getByText('Download Latest Report')).toBeInTheDocument();
    expect(downloadReportButton).toBeInTheDocument();
    expect(screen.getByTestId('report-filters')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/activities/${mockedActivity.id}/answers`,
        {
          params: {
            emptyIdentifiers: true,
            fromDatetime: '2024-01-17T00:00:00',
            identifiers: undefined,
            respondentId: mockedRespondentId,
            toDatetime: '2024-01-23T23:59:00',
            versions: '2.0.0,2.0.1',
          },
          signal: undefined,
        },
      );
    });

    rerender(<Report activity={mockedActivity} identifiers={[]} versions={[]} />);

    // assertions after component update
    expect(screen.getByTestId('report-activity-completed')).toBeInTheDocument();
    expect(screen.getByTestId('report-response-options')).toBeInTheDocument();

    userEvent.click(downloadReportButton);

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/activities/${mockedActivity.id}/answers/${mockedRespondentId}/latest_report`,
        {},
        { responseType: 'arraybuffer', signal: undefined },
      );
    });

    // base64 for 'data' is ZGF0YQ==
    expect(download).toHaveBeenCalledWith(
      'data:application/pdf;base64,ZGF0YQ==',
      'Report.pdf',
      'text/pdf',
    );
  });

  test('renders Report correctly with no data', async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: null,
      },
    });

    const { rerender } = renderWithProviders(
      <Report activity={mockedActivity} identifiers={[]} versions={[]} />,
      {
        route,
        routePath,
        preloadedState,
      },
    );

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/activities/${mockedActivity.id}/answers`,
        {
          params: {
            emptyIdentifiers: true,
            fromDatetime: '2024-01-17T00:00:00',
            identifiers: undefined,
            respondentId: mockedRespondentId,
            toDatetime: '2024-01-23T23:59:00',
            versions: '2.0.0,2.0.1',
          },
          signal: undefined,
        },
      );
    });

    rerender(<Report activity={mockedActivity} identifiers={[]} versions={[]} />);

    // assertions for no data scenario
    expect(screen.getByTestId('report-empty-state')).toBeInTheDocument();
    expect(screen.getByText('No match was found. Try to adjust filters.')).toBeInTheDocument();
  });
});
