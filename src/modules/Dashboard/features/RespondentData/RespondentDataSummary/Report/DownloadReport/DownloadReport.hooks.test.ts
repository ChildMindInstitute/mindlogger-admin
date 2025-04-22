import { act, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import download from 'downloadjs';

import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { mockedAppletId, mockedFullSubjectId1 } from 'shared/mock';

import { useDownloadReport } from './DownloadReport.hooks';

const mockedUseParams = vi.fn();
vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => mockedUseParams,
  };
});

jest.mock('downloadjs');

const activityId = 'activity-id';
const flowId = 'flow-id';

export const getMockedApplet = ({
  generateReport,
  reportPublicKey,
  isSingleReport,
}: {
  generateReport?: boolean;
  reportPublicKey?: string | null;
  isSingleReport?: boolean;
}) => ({
  displayName: 'Test Applet',
  reportPublicKey,
  activities: [
    {
      name: 'New Activity',
      id: activityId,
      items: [],
      scoresAndReports: {
        generateReport,
        reports: [],
        showScoreSummary: false,
      },
    },
  ],
  activityFlows: [
    {
      name: 'Flow 1',
      id: flowId,
      isSingleReport,
    },
  ],
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getPreloadedState = (applet) => ({
  applet: {
    applet: { data: { result: applet } },
  },
});

const testDownloadReport = async (result: { current: unknown }, isFlow: boolean) => {
  mockAxios.post.mockResolvedValueOnce({
    data: 'reportData',
    headers: { 'content-disposition': 'attachment; filename=report.pdf' },
  });

  const currentResult = result.current as ReturnType<typeof useDownloadReport>;
  expect(currentResult.downloadReportError).toBeNull();
  expect(currentResult.isDownloadReportDisabled).toBe(false);
  expect(currentResult.isDownloadReportLoading).toBe(false);

  act(() => {
    currentResult.downloadReportHandler();
  });

  await waitFor(() => {
    expect(mockAxios.post).toBeCalledWith(
      `/answers/applet/${mockedAppletId}/${
        isFlow ? `flows/${flowId}` : `activities/${activityId}`
      }/subjects/${mockedFullSubjectId1}/latest_report`,
      {},
      { responseType: 'arraybuffer', signal: undefined },
    );
    expect(download).toHaveBeenCalledWith(
      'data:application/pdf;base64,cmVwb3J0RGF0YQ==',
      'Report.pdf',
      'text/pdf',
    );
  });
};

describe('useDownloadReport', () => {
  beforeEach(() => {
    mockedUseParams.mockReturnValue({
      appletId: mockedAppletId,
      subjectId: mockedFullSubjectId1,
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  test.each`
    isFlow   | generateReport | reportPublicKey | isSingleReport | isDownloadDisabled
    ${false} | ${true}        | ${null}         | ${undefined}   | ${true}
    ${false} | ${true}        | ${''}           | ${undefined}   | ${true}
    ${false} | ${true}        | ${undefined}    | ${undefined}   | ${true}
    ${false} | ${true}        | ${'public-key'} | ${undefined}   | ${false}
    ${false} | ${false}       | ${null}         | ${undefined}   | ${true}
    ${false} | ${false}       | ${''}           | ${undefined}   | ${true}
    ${false} | ${false}       | ${undefined}    | ${undefined}   | ${true}
    ${false} | ${false}       | ${'public-key'} | ${undefined}   | ${true}
    ${true}  | ${true}        | ${'public-key'} | ${true}        | ${false}
    ${true}  | ${false}       | ${'public-key'} | ${true}        | ${true}
  `(
    `returns isDownloadReportDisabled=$isDownloadDisabled, when isFlow=$isFlow, generateReport=$generateReport, reportPublicKey=$reportPublicKey, and isSingleReport=$isSingleReport`,
    ({ isFlow, generateReport, reportPublicKey, isSingleReport, isDownloadDisabled }) => {
      const { result } = renderHookWithProviders(
        () => useDownloadReport({ id: isFlow ? flowId : activityId, isFlow }),
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          preloadedState: getPreloadedState(
            getMockedApplet({ generateReport, reportPublicKey, isSingleReport }),
          ),
        },
      );

      const currentResult = result.current as ReturnType<typeof useDownloadReport>;
      expect(currentResult.isDownloadReportDisabled).toBe(isDownloadDisabled);
      expect(currentResult.isDownloadReportLoading).toBe(false);
      expect(currentResult.downloadReportError).toBe(null);
    },
  );

  test('handles download report for Activity', async () => {
    const { result } = renderHookWithProviders(
      () => useDownloadReport({ id: activityId, isFlow: false }),
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        preloadedState: getPreloadedState(
          getMockedApplet({ generateReport: true, reportPublicKey: 'some-key' }),
        ),
      },
    );

    await testDownloadReport(result, false);
  });

  test('handles download report for Flow', async () => {
    const { result } = renderHookWithProviders(
      () => useDownloadReport({ id: flowId, isFlow: true }),
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        preloadedState: getPreloadedState(
          getMockedApplet({
            generateReport: true,
            reportPublicKey: 'some-key',
            isSingleReport: true,
          }),
        ),
      },
    );

    await testDownloadReport(result, true);
  });
});
