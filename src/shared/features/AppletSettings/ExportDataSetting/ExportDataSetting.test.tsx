import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { addDays, roundToNearestMinutes, startOfDay } from 'date-fns';
import { vi } from 'vitest';

import { ExportData } from 'api';
import { initialStateData } from 'redux/modules';
import { mockedApplet, mockedPassword } from 'shared/mock';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import * as encryptionFunctions from 'shared/utils/encryption';

import { ExportDataSetting } from './ExportDataSetting';
import { ExportDateType } from './ExportDataSetting.types';

const createdDate = '2023-11-14T14:43:33.369902';
// Set a fixed "now" date for consistent test results
const mockedNow = new Date('2023-11-14T16:10:00.000Z');

const preloadedState = {
  applet: {
    applet: {
      ...initialStateData,
      data: { result: { ...mockedApplet, createdAt: createdDate } },
    },
  },
};

const getPublicKeyMock = () => Buffer.from(JSON.parse(mockedApplet?.encryption?.publicKey || ''));

const mockedExportDataApi = vi.fn();

vi.mock('modules/Dashboard/api', () => ({
  getExportDataApi: (body: ExportData) => mockedExportDataApi(body),
}));

vi.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: () => ({
    featureFlags: {
      enableDataExportSpeedUp: false, // Use old DataExportPopup which has Last24h special handling
    },
  }),
}));

const dataTestId = 'export-data';

describe('ExportDataSetting', () => {
  beforeEach(() => {
    // Mock Date to return a fixed date for consistent test results
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(mockedNow);
    mockedExportDataApi.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not render export settings model if isExportSettingsOpen is false', async () => {
    const mockOnClose = vi.fn();

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
    const mockOnClose = vi.fn();

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
      exportType                  | expectedFromTime                       | description
      ${ExportDateType.AllTime}   | ${startOfDay(new Date(createdDate))}   | ${'use applet create time and now for all time'}
      ${ExportDateType.Last24h}   | ${addDays(mockedNow, -1)}              | ${'use correct dates for last 24h'}
      ${ExportDateType.LastWeek}  | ${startOfDay(addDays(mockedNow, -7))}  | ${'use correct dates for last week'}
      ${ExportDateType.LastMonth} | ${startOfDay(addDays(mockedNow, -30))} | ${'use correct dates for last month'}
    `('$description', async ({ exportType, expectedFromTime }) => {
      const mockOnClose = vi.fn();

      vi.spyOn(encryptionFunctions, 'getAppletEncryptionInfo').mockImplementation(() =>
        Promise.resolve({
          getPublicKey: getPublicKeyMock,
        }),
      );

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

      const dateTypeField = screen.getByTestId(`${`${dataTestId}-settings`}-dateType`);
      expect(dateTypeField).toBeVisible();
      
      // Open the select dropdown
      const selectButton = dateTypeField.querySelector('[role="button"]');
      if (selectButton) {
        fireEvent.mouseDown(selectButton);
      }
      
      // Wait for dropdown to open and select the option
      await waitFor(() => {
        const options = screen.getAllByRole('option');
        const targetOption = options.find(
          (option) => option.getAttribute('data-value') === exportType,
        );
        if (targetOption) {
          fireEvent.click(targetOption);
        }
      });

      // Wait for the useEffect to update the dates based on the new dateType
      await waitFor(() => {
        // Give the component time to process the dateType change
      });

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
          roundToNearestMinutes(new Date(requestBody.fromDate), {
            nearestTo: 10,
          }),
        ).toEqual(
          roundToNearestMinutes(expectedFromTime, {
            nearestTo: 10,
          }),
        );
      });
    });
  });
});
