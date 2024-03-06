import { fireEvent, screen, waitFor } from '@testing-library/react';

import { initialStateData } from 'redux/modules';
import { mockedApplet } from 'shared/mock';
import { renderWithProviders } from 'shared/utils';

import { ExportDataSetting } from './ExportDataSetting';
import {
  DATA_TESTID_EXPORT_DATA_EXPORT_POPUP,
  DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP,
} from './ExportDataSetting.const';

const preloadedState = {
  applet: {
    applet: {
      ...initialStateData,
      data: { result: { ...mockedApplet, createdAt: '2023-11-14T14:43:33.369902' } },
    },
  },
};

describe('ExportDataSetting', () => {
  it('should not render export settings model if isExportSettingsOpen is false', async () => {
    const mockOnClose = jest.fn();

    renderWithProviders(
      <ExportDataSetting isExportSettingsOpen={false} onExportSettingsClose={mockOnClose} />,
      {
        preloadedState,
      },
    );

    await waitFor(() => {
      expect(screen.queryByTestId(DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP)).not.toBeInTheDocument();
      expect(screen.queryByTestId(DATA_TESTID_EXPORT_DATA_EXPORT_POPUP)).not.toBeInTheDocument();
    });
  });

  it('should call close callback and open the export popup if the settings download button is clicked', async () => {
    const mockOnClose = jest.fn();

    renderWithProviders(
      <ExportDataSetting isExportSettingsOpen onExportSettingsClose={mockOnClose} />,
      {
        preloadedState,
      },
    );

    await waitFor(() =>
      expect(screen.queryByTestId(DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText('Download CSV'));

    await waitFor(() =>
      expect(screen.getByTestId(`${DATA_TESTID_EXPORT_DATA_EXPORT_POPUP}-password`)).toBeVisible(),
    );

    expect(mockOnClose).toHaveBeenCalled();
  });
});
