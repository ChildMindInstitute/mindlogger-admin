import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import * as useDownloadReportHook from './DownloadReport.hooks';
import { DownloadReport } from './DownloadReport';
import { DownloadReportProps } from './DownloadReport.types';

const dataTestId = 'download-report';

const renderComponent = (props?: Partial<DownloadReportProps>) =>
  renderWithProviders(
    <DownloadReport id="activity-id" isFlow={false} data-testid={dataTestId} {...props} />,
  );

const mockDownloadReportHandler = jest.fn();

const checkPositiveScenario = async (buttonText: string) => {
  expect(screen.getByTestId(dataTestId)).toBeInTheDocument();
  const downloadButton = screen.getByTestId(`${dataTestId}-button`);
  expect(downloadButton).toBeEnabled();
  expect(within(downloadButton).queryByText(buttonText)).toBeInTheDocument();
  expect(screen.queryByTestId(`${dataTestId}-loader`)).not.toBeInTheDocument();
  expect(screen.queryByTestId(`${dataTestId}-error`)).not.toBeInTheDocument();

  await userEvent.hover(downloadButton);
  expect(
    screen.queryByText('Please configure the report server to download the report.'),
  ).not.toBeInTheDocument();

  await userEvent.click(downloadButton);
  expect(mockDownloadReportHandler).toHaveBeenCalled();
};

describe('DownloadReport', () => {
  test('renders component correctly for Activity (isFlow="false", isDownloadReportDisabled="false")', async () => {
    jest.spyOn(useDownloadReportHook, 'useDownloadReport').mockReturnValue({
      downloadReportHandler: mockDownloadReportHandler,
      downloadReportError: null,
      isDownloadReportDisabled: false,
      isDownloadReportLoading: false,
    });

    renderComponent();

    await checkPositiveScenario('Download Latest Report');
  });

  test('renders component correctly for Activity Flow (isFlow="true", isDownloadReportDisabled="false")', async () => {
    jest.spyOn(useDownloadReportHook, 'useDownloadReport').mockReturnValue({
      downloadReportHandler: mockDownloadReportHandler,
      downloadReportError: null,
      isDownloadReportDisabled: false,
      isDownloadReportLoading: false,
    });

    renderComponent({ isFlow: true });

    await checkPositiveScenario('Download Latest Report (Combined)');
  });

  test('renders component correctly if isDownloadReportDisabled is true', async () => {
    jest.spyOn(useDownloadReportHook, 'useDownloadReport').mockReturnValue({
      downloadReportHandler: mockDownloadReportHandler,
      downloadReportError: null,
      isDownloadReportDisabled: true,
      isDownloadReportLoading: false,
    });

    renderComponent();

    expect(screen.getByTestId(dataTestId)).toBeInTheDocument();
    const downloadButtonWrapper = screen.getByTestId(`${dataTestId}-button-wrapper`);
    await userEvent.hover(downloadButtonWrapper);
    await waitFor(() => {
      expect(
        screen.getByText('Please configure the report server to download the report.'),
      ).toBeInTheDocument();
    });

    const downloadButton = screen.getByTestId(`${dataTestId}-button`);
    expect(downloadButton).toBeDisabled();
  });

  test('renders component correctly if isDownloadReportLoading is true', async () => {
    jest.spyOn(useDownloadReportHook, 'useDownloadReport').mockReturnValue({
      downloadReportHandler: mockDownloadReportHandler,
      downloadReportError: null,
      isDownloadReportDisabled: false,
      isDownloadReportLoading: true,
    });

    renderComponent();

    expect(screen.getByTestId(`${dataTestId}-button`)).toBeDisabled();
    expect(screen.getByTestId(`${dataTestId}-loader`)).toBeInTheDocument();
  });

  test('renders component correctly if there is an error', async () => {
    jest.spyOn(useDownloadReportHook, 'useDownloadReport').mockReturnValue({
      downloadReportHandler: mockDownloadReportHandler,
      downloadReportError: 'some error',
      isDownloadReportDisabled: false,
      isDownloadReportLoading: false,
    });

    renderComponent();

    expect(screen.getByTestId(`${dataTestId}-error`)).toBeInTheDocument();
    expect(screen.getByText('some error')).toBeInTheDocument();
  });
});
