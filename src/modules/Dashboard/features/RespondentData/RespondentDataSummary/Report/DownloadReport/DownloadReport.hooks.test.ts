import { act, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import download from 'downloadjs';

import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { mockedAppletId, mockedRespondentId } from 'shared/mock';

import { useDownloadReport } from './DownloadReport.hooks';

const mockedUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));

jest.mock('downloadjs');

const activityId = 'activity-id';

export const getMockedApplet = ({
  generateReport,
  reportPublicKey,
}: {
  generateReport?: boolean;
  reportPublicKey?: string | null;
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
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getPreloadedState = (applet) => ({
  applet: {
    applet: { data: { result: applet } },
  },
});

describe('useDownloadReport', () => {
  beforeEach(() => {
    mockedUseParams.mockReturnValue({
      appletId: mockedAppletId,
      respondentId: mockedRespondentId,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each`
    generateReport | reportPublicKey | expected
    ${true}        | ${null}         | ${true}
    ${true}        | ${''}           | ${true}
    ${true}        | ${undefined}    | ${true}
    ${true}        | ${'public-key'} | ${false}
    ${false}       | ${null}         | ${true}
    ${false}       | ${''}           | ${true}
    ${false}       | ${undefined}    | ${true}
    ${false}       | ${'public-key'} | ${true}
  `(
    `returns isDownloadReportDisabled=$expected, when generateReport=$generateReport and reportPublicKey=$reportPublicKey`,
    ({ generateReport, reportPublicKey, expected }) => {
      const { result } = renderHookWithProviders(
        () => useDownloadReport({ id: activityId, isFlow: false }),
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          preloadedState: getPreloadedState(getMockedApplet({ generateReport, reportPublicKey })),
        },
      );

      const currentResult = result.current as ReturnType<typeof useDownloadReport>;
      expect(currentResult.isDownloadReportDisabled).toBe(expected);
      expect(currentResult.isDownloadReportLoading).toBe(false);
      expect(currentResult.downloadReportError).toBe(null);
    },
  );

  test('handles download report for Activity', async () => {
    // const mockedDownload = jest.spyOn(downloadJs, 'default').mockImplementation(() => {});
    mockAxios.post.mockResolvedValueOnce({
      data: 'reportData',
      headers: { 'content-disposition': 'attachment; filename=report.pdf' },
    });
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

    const currentResult = result.current as ReturnType<typeof useDownloadReport>;
    expect(currentResult.downloadReportError).toBeNull();
    expect(currentResult.isDownloadReportDisabled).toBe(false);
    expect(currentResult.isDownloadReportLoading).toBe(false);

    act(() => {
      currentResult.downloadReportHandler();
    });

    await waitFor(() => {
      expect(download).toHaveBeenCalledWith(
        'data:application/pdf;base64,cmVwb3J0RGF0YQ==',
        'Report.pdf',
        'text/pdf',
      );
    });
  });
});
