import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils';

import { ReportHeader } from './ReportHeader';
import { ReportHeaderProps } from './ReportHeader.types';

const mockOnButtonClick = jest.fn();
const defaultProps = {
  containerRef: { current: null },
  onButtonClick: mockOnButtonClick,
  activityName: 'Activity Name',
  isButtonDisabled: false,
  error: null,
};

const renderReportHeader = (props: ReportHeaderProps) =>
  renderWithProviders(<ReportHeader {...props} />);

describe('ReportHeader', () => {
  test('renders correctly, process button click', async () => {
    const { container } = renderReportHeader(defaultProps);

    expect(container).toBeTruthy();
    expect(screen.getByText('Activity Name')).toBeInTheDocument();
    expect(screen.getByText('Download Latest Report')).toBeInTheDocument();

    expect(
      screen.getByLabelText('Please configure the report server to download the report.'),
    ).toBeInTheDocument();

    const downloadButton = screen.getByRole('button');
    expect(downloadButton).toBeEnabled();
    await userEvent.click(downloadButton);

    expect(mockOnButtonClick).toHaveBeenCalledTimes(1);
  });

  test('renders correctly with disabled button', async () => {
    renderReportHeader({ ...defaultProps, isButtonDisabled: true });
    const downloadButton = screen.getByRole('button');

    expect(downloadButton).toBeDisabled();
  });

  test('renders error if provided', async () => {
    renderReportHeader({ ...defaultProps, error: 'some error text' });

    expect(screen.getByText('some error text')).toBeInTheDocument();
  });
});
