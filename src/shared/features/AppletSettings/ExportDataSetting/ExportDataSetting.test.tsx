import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { addDays, roundToNearestMinutes } from 'date-fns';
import { AxiosResponse } from 'axios';

import { initialStateData } from 'redux/modules';
import { mockedApplet, mockedPassword } from 'shared/mock';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import * as encryptionFunctions from 'shared/utils/encryption';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { useHasEhrHealthData } from 'shared/hooks/useHasEhrHealthData';
import * as apiFunctions from 'modules/Dashboard/api';
import { mockSuccessfulHttpResponse } from 'shared/utils/axios-mocks';
import { ResponseWithObject } from 'api';
import { ExportDataResult } from 'shared/types';
import * as ScheduleHistoryExporterClasses from 'shared/utils/exportData/exporters/ScheduleHistoryExporter';
import * as FlowActivityHistoryExporterClasses from 'shared/utils/exportData/exporters/FlowActivityHistoryExporter';
import * as EHRDataExporterClasses from 'shared/utils/exportData/exporters/EHRDataExporter';
import { getPreloadedState } from 'shared/tests/getPreloadedState';

import { ExportDataExported, ExportDateType } from './ExportDataSetting.types';
import { ExportDataSetting } from './ExportDataSetting';

const createdDate = '2023-11-14T14:43:33.369902';

const preloadedState = {
  ...getPreloadedState(),
  applet: {
    applet: {
      ...initialStateData,
      data: { result: { ...mockedApplet, createdAt: createdDate } },
    },
  },
};

const getPublicKeyMock = () => Buffer.from(JSON.parse(mockedApplet?.encryption?.publicKey || ''));

jest.mock('modules/Dashboard/api', () => ({
  ...jest.requireActual('modules/Dashboard/api'),
  getExportDataApi: jest.fn(),
}));

jest.mock('shared/hooks/useFeatureFlags', () => ({
  ...jest.requireActual('shared/hooks/useFeatureFlags'),
  useFeatureFlags: jest.fn(),
}));

jest.mock('shared/hooks/useHasEhrHealthData', () => ({
  useHasEhrHealthData: jest.fn(),
}));

jest.mock('shared/utils/exportData/exporters/ScheduleHistoryExporter', () => ({
  ScheduleHistoryExporter: jest.fn(),
}));

jest.mock('shared/utils/exportData/exporters/FlowActivityHistoryExporter', () => ({
  FlowActivityHistoryExporter: jest.fn(),
}));

jest.mock('shared/utils/exportData/exporters/EHRDataExporter', () => ({
  EHRDataExporter: jest.fn(),
}));

jest.mock('shared/utils/exportTemplate', () => ({
  exportTemplate: jest.fn(),
}));

const dataTestId = 'export-data';

describe('ExportDataSetting', () => {
  const mockedExportDataApi = jest.spyOn(apiFunctions, 'getExportDataApi');
  const mockedScheduleHistoryExporter = jest
    .spyOn(ScheduleHistoryExporterClasses, 'ScheduleHistoryExporter')
    .mockImplementation(
      () =>
        ({
          exportData: jest.fn().mockResolvedValue(true),
        }) as unknown as ScheduleHistoryExporterClasses.ScheduleHistoryExporter,
    );
  const mockedFlowHistoryExporter = jest
    .spyOn(FlowActivityHistoryExporterClasses, 'FlowActivityHistoryExporter')
    .mockImplementation(
      () =>
        ({
          exportData: jest.fn().mockResolvedValue(true),
        }) as unknown as FlowActivityHistoryExporterClasses.FlowActivityHistoryExporter,
    );
  const mockedEhrDataExporter = jest
    .spyOn(EHRDataExporterClasses, 'EHRDataExporter')
    .mockImplementation(
      () =>
        ({
          exportData: jest.fn().mockResolvedValue(true),
        }) as unknown as EHRDataExporterClasses.EHRDataExporter,
    );

  beforeEach(() => {
    jest.mocked(useFeatureFlags).mockReturnValue({
      featureFlags: {
        enableEmaExtraFiles: true,
        enableEhrHealthData: 'active',
        enableDataExportSpeedUp: false,
      },
      resetLDContext: jest.fn(),
    });

    jest.spyOn(encryptionFunctions, 'getAppletEncryptionInfo').mockImplementation(() =>
      Promise.resolve({
        getPublicKey: getPublicKeyMock,
      }),
    );

    mockedExportDataApi.mockResolvedValue(
      mockSuccessfulHttpResponse({
        result: {
          answers: [],
          activities: [],
        },
        count: 0,
      }) as AxiosResponse<ResponseWithObject<ExportDataResult>>,
    );
  });

  it('should render nothing if isExportSettingsOpen is false', async () => {
    const mockOnClose = jest.fn();

    renderWithProviders(
      <ExportDataSetting
        isExportSettingsOpen={false}
        onExportSettingsClose={mockOnClose}
        data-testid={dataTestId}
      />,
      {
        preloadedState,
      },
    );

    await waitFor(() => {
      expect(screen.queryByTestId(`${dataTestId}-settings`)).not.toBeInTheDocument();
      expect(screen.queryByTestId(`${dataTestId}-modal`)).not.toBeInTheDocument();
    });
  });

  it('should call close callback and open the export popup if the settings download button is clicked', async () => {
    const mockOnClose = jest.fn();

    renderWithProviders(
      <ExportDataSetting
        isExportSettingsOpen
        onExportSettingsClose={mockOnClose}
        data-testid={dataTestId}
      />,
      {
        preloadedState,
      },
    );

    await waitFor(() => expect(screen.queryByTestId(`${dataTestId}-settings`)).toBeInTheDocument());

    fireEvent.click(screen.getByText('Download'));

    await waitFor(() => expect(screen.getByTestId(`${dataTestId}-modal-password`)).toBeVisible());

    expect(mockOnClose).toHaveBeenCalled();
  });

  describe('should pass settings specified in settings popup to the export popup', () => {
    test.each`
      exportType                  | expectedFromTime            | description
      ${ExportDateType.AllTime}   | ${new Date(createdDate)}    | ${'use applet create time and now for all time'}
      ${ExportDateType.Last24h}   | ${addDays(new Date(), -1)}  | ${'use correct dates for last 24h'}
      ${ExportDateType.LastWeek}  | ${addDays(new Date(), -7)}  | ${'use correct dates for last week'}
      ${ExportDateType.LastMonth} | ${addDays(new Date(), -30)} | ${'use correct dates for last month'}
    `('$description', async ({ exportType, expectedFromTime }) => {
      const mockOnClose = jest.fn();

      renderWithProviders(
        <ExportDataSetting
          isExportSettingsOpen
          onExportSettingsClose={mockOnClose}
          data-testid={dataTestId}
        />,
        {
          preloadedState,
        },
      );

      await waitFor(() =>
        expect(screen.queryByTestId(`${dataTestId}-settings`)).toBeInTheDocument(),
      );

      const dateType = screen.getByTestId(`${`${dataTestId}-settings`}-dateType`);
      expect(dateType).toBeVisible();
      const input = dateType.querySelector('input');
      input && fireEvent.change(input, { target: { value: exportType } });

      fireEvent.click(screen.getByText('Download'));

      expect(screen.getByTestId(`${dataTestId}-modal-password`)).toBeVisible();

      fireEvent.change(await screen.findByLabelText('Password'), {
        target: { value: mockedPassword },
      });

      fireEvent.click(
        within(screen.getByTestId(`${dataTestId}-modal-password`)).getByText('Submit'),
      );

      await waitFor(() => {
        const requestBody = mockedExportDataApi.mock.calls[0][0];

        expect(requestBody).toHaveProperty('appletId', mockedApplet.id);
        expect(requestBody).toHaveProperty('fromDate');
        expect(requestBody).toHaveProperty('toDate');

        // When checking relative dates, round the date to the nearest
        // 10 minute to account for the test run time.
        expect(
          roundToNearestMinutes(new Date(requestBody.fromDate as string), {
            nearestTo: 10,
          }),
        ).toEqual(
          roundToNearestMinutes(expectedFromTime, {
            nearestTo: 10,
          }),
        );
      });
    });

    it('should pass schedule history setting to the export popup', async () => {
      jest.mocked(useFeatureFlags).mockReturnValue({
        featureFlags: {
          enableEmaExtraFiles: true,
          enableEhrHealthData: 'unavailable',
          enableDataExportSpeedUp: false,
        },
        resetLDContext: jest.fn(),
      });

      const mockOnClose = jest.fn();
      jest.mocked(useHasEhrHealthData).mockReturnValue(false);

      renderWithProviders(
        <ExportDataSetting
          isExportSettingsOpen
          onExportSettingsClose={mockOnClose}
          data-testid={dataTestId}
        />,
        {
          preloadedState,
        },
      );

      await waitFor(() =>
        expect(screen.queryByTestId(`${dataTestId}-settings`)).toBeInTheDocument(),
      );

      const scheduleHistoryCheckbox = screen
        .getByText('Include schedule history')
        .closest('label')
        ?.querySelector('input');

      expect(scheduleHistoryCheckbox).toBeInTheDocument();

      if (scheduleHistoryCheckbox) {
        fireEvent.click(scheduleHistoryCheckbox);
      }

      fireEvent.click(screen.getByText('Download'));

      expect(screen.getByTestId(`${dataTestId}-modal-password`)).toBeVisible();

      fireEvent.change(await screen.findByLabelText('Password'), {
        target: { value: mockedPassword },
      });

      fireEvent.click(
        within(screen.getByTestId(`${dataTestId}-modal-password`)).getByText('Submit'),
      );

      await waitFor(() => {
        expect(mockedScheduleHistoryExporter).toHaveBeenCalled();
      });
    });

    it('should pass flow history setting to the export popup', async () => {
      jest.mocked(useFeatureFlags).mockReturnValue({
        featureFlags: {
          enableEmaExtraFiles: true,
          enableEhrHealthData: 'unavailable',
          enableDataExportSpeedUp: false,
        },
        resetLDContext: jest.fn(),
      });

      const mockOnClose = jest.fn();
      jest.mocked(useHasEhrHealthData).mockReturnValue(false);

      renderWithProviders(
        <ExportDataSetting
          isExportSettingsOpen
          onExportSettingsClose={mockOnClose}
          data-testid={dataTestId}
        />,
        {
          preloadedState,
        },
      );

      await waitFor(() =>
        expect(screen.queryByTestId(`${dataTestId}-settings`)).toBeInTheDocument(),
      );

      const flowHistoryCheckbox = screen
        .getByText('Include activity flow history')
        .closest('label')
        ?.querySelector('input');

      expect(flowHistoryCheckbox).toBeInTheDocument();

      if (flowHistoryCheckbox) {
        fireEvent.click(flowHistoryCheckbox);
      }

      fireEvent.click(screen.getByText('Download'));

      expect(screen.getByTestId(`${dataTestId}-modal-password`)).toBeVisible();

      fireEvent.change(await screen.findByLabelText('Password'), {
        target: { value: mockedPassword },
      });

      fireEvent.click(
        within(screen.getByTestId(`${dataTestId}-modal-password`)).getByText('Submit'),
      );

      await waitFor(() => {
        expect(mockedFlowHistoryExporter).toHaveBeenCalled();
      });
    });

    it('should pass EHR health data setting to the export popup', async () => {
      jest.mocked(useFeatureFlags).mockReturnValue({
        featureFlags: {
          enableEmaExtraFiles: false,
          enableEhrHealthData: 'active',
          enableDataExportSpeedUp: false,
        },
        resetLDContext: jest.fn(),
      });

      const mockOnClose = jest.fn();
      jest.mocked(useHasEhrHealthData).mockReturnValue(true);

      renderWithProviders(
        <ExportDataSetting
          isExportSettingsOpen
          onExportSettingsClose={mockOnClose}
          data-testid={dataTestId}
        />,
        {
          preloadedState,
        },
      );

      await waitFor(() =>
        expect(screen.queryByTestId(`${dataTestId}-settings`)).toBeInTheDocument(),
      );

      // Reset the mock before the test
      jest.clearAllMocks();

      // Select the ResponsesAndEhrData option
      const exportDataExportedSetting = screen.getByTestId(
        `${`${dataTestId}-settings`}-data-exported`,
      );
      expect(exportDataExportedSetting).toBeVisible();
      const input = exportDataExportedSetting.querySelector('input');
      input &&
        fireEvent.change(input, { target: { value: ExportDataExported.ResponsesAndEhrData } });

      fireEvent.click(screen.getByText('Download'));

      expect(screen.getByTestId(`${dataTestId}-modal-password`)).toBeVisible();

      fireEvent.change(await screen.findByLabelText('Password'), {
        target: { value: mockedPassword },
      });

      fireEvent.click(
        within(screen.getByTestId(`${dataTestId}-modal-password`)).getByText('Submit'),
      );

      await waitFor(() => {
        // Verify that the EHR data exporter was instantiated
        expect(mockedEhrDataExporter).toHaveBeenCalled();
      });
    });
  });
});
