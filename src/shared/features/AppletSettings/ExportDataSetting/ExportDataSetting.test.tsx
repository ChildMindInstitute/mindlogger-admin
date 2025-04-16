import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { addDays, roundToNearestMinutes } from 'date-fns';

import { ExportData } from 'api';
import { initialStateData } from 'redux/modules';
import { mockedApplet, mockedPassword } from 'shared/mock';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import * as encryptionFunctions from 'shared/utils/encryption';

import { ExportDataSetting } from './ExportDataSetting';
import { ExportDateType } from './ExportDataSetting.types';

const createdDate = '2023-11-14T14:43:33.369902';

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

jest.mock('modules/Dashboard/api', () => ({
  getExportDataApi: (body: ExportData) => mockedExportDataApi(body),
}));

const dataTestId = 'export-data';

describe('ExportDataSetting', () => {
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
      exportType                  | expectedFromTime            | description
      ${ExportDateType.AllTime}   | ${new Date(createdDate)}    | ${'use applet create time and now for all time'}
      ${ExportDateType.Last24h}   | ${addDays(new Date(), -1)}  | ${'use correct dates for last 24h'}
      ${ExportDateType.LastWeek}  | ${addDays(new Date(), -7)}  | ${'use correct dates for last week'}
      ${ExportDateType.LastMonth} | ${addDays(new Date(), -30)} | ${'use correct dates for last month'}
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
