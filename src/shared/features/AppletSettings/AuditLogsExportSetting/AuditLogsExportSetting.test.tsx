import { fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { initialStateData } from 'redux/modules';
import { mockedApplet } from 'shared/mock';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { AuditLogsExportSetting } from './AuditLogsExportSetting';

const createdDate = '2023-11-14T14:43:33.369902';
const mockedNow = new Date('2023-11-14T16:10:00.000Z');

const preloadedState = {
  applet: {
    applet: {
      ...initialStateData,
      data: { result: { ...mockedApplet, createdAt: createdDate } },
    },
  },
};

const mockedExportAuditLogsApi = vi.fn();

vi.mock('modules/Dashboard/api', () => ({
  getExportAuditLogsApi: (...args: unknown[]) => mockedExportAuditLogsApi(...args),
}));

vi.mock('shared/utils/exportTemplate', () => ({
  exportTemplate: vi.fn().mockResolvedValue(true),
}));

const dataTestId = 'audit-logs-export';

describe('AuditLogsExportSetting', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(mockedNow);
    mockedExportAuditLogsApi.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not render export settings popup if isExportSettingsOpen is false', async () => {
    const mockOnClose = vi.fn();
    const mockOnExportClose = vi.fn();

    renderWithProviders(
      <AuditLogsExportSetting
        isExportSettingsOpen={false}
        onExportSettingsClose={mockOnClose}
        onExportPopupClose={mockOnExportClose}
        data-testid={dataTestId}
      />,
      { preloadedState },
    );

    await waitFor(() => {
      expect(screen.queryByTestId(`${dataTestId}-settings`)).not.toBeInTheDocument();
      expect(screen.queryByTestId(`${dataTestId}-modal`)).not.toBeInTheDocument();
    });
  });

  it('should call close callback and open the export popup if the settings download button is clicked', async () => {
    const mockOnClose = vi.fn();
    const mockOnExportClose = vi.fn();

    mockedExportAuditLogsApi.mockResolvedValueOnce({
      data: { result: [], count: 0 },
    });

    renderWithProviders(
      <AuditLogsExportSetting
        isExportSettingsOpen
        onExportSettingsClose={mockOnClose}
        onExportPopupClose={mockOnExportClose}
        data-testid={dataTestId}
      />,
      { preloadedState },
    );

    await waitFor(() =>
      expect(screen.queryByTestId(`${dataTestId}-settings`)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId(`${dataTestId}-settings-download-button`));

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should only call the export API once even if the effect re-fires', async () => {
    const mockOnClose = vi.fn();
    const mockOnExportClose = vi.fn();

    mockedExportAuditLogsApi.mockResolvedValue({
      data: { result: [], count: 0 },
    });

    renderWithProviders(
      <AuditLogsExportSetting
        isExportSettingsOpen
        onExportSettingsClose={mockOnClose}
        onExportPopupClose={mockOnExportClose}
        data-testid={dataTestId}
      />,
      { preloadedState },
    );

    fireEvent.click(screen.getByTestId(`${dataTestId}-settings-download-button`));

    await waitFor(() => {
      expect(mockedExportAuditLogsApi).toHaveBeenCalledTimes(1);
    });
  });

  it('should show error modal when the export API fails', async () => {
    const mockOnClose = vi.fn();
    const mockOnExportClose = vi.fn();

    mockedExportAuditLogsApi.mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(
      <AuditLogsExportSetting
        isExportSettingsOpen
        onExportSettingsClose={mockOnClose}
        onExportPopupClose={mockOnExportClose}
        data-testid={dataTestId}
      />,
      { preloadedState },
    );

    fireEvent.click(screen.getByTestId(`${dataTestId}-settings-download-button`));

    await waitFor(() => {
      expect(screen.getByTestId(`${dataTestId}-modal-error`)).toBeInTheDocument();
    });
  });

  it('should retry the export when retry button is clicked after an error', async () => {
    const mockOnClose = vi.fn();
    const mockOnExportClose = vi.fn();

    mockedExportAuditLogsApi.mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(
      <AuditLogsExportSetting
        isExportSettingsOpen
        onExportSettingsClose={mockOnClose}
        onExportPopupClose={mockOnExportClose}
        data-testid={dataTestId}
      />,
      { preloadedState },
    );

    fireEvent.click(screen.getByTestId(`${dataTestId}-settings-download-button`));

    await waitFor(() => {
      expect(screen.getByTestId(`${dataTestId}-modal-error`)).toBeInTheDocument();
    });

    mockedExportAuditLogsApi.mockResolvedValueOnce({
      data: { result: [], count: 0 },
    });

    fireEvent.click(screen.getByTestId(`${dataTestId}-modal-error-submit-button`));

    await waitFor(() => {
      expect(mockedExportAuditLogsApi).toHaveBeenCalledTimes(2);
    });
  });
});
