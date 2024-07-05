import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ReportHeader } from './ReportHeader';
import { ReportHeaderProps } from './ReportHeader.types';

const selectedEntity = {
  id: 'entity-id',
  name: 'Activity 123',
  lastAnswerDate: null,
  hasAnswer: true,
  isFlow: false,
};
const defaultProps = {
  containerRef: { current: null },
  selectedEntity,
};

const renderReportHeader = (props: ReportHeaderProps) =>
  renderWithProviders(<ReportHeader {...props} />);

describe('ReportHeader', () => {
  test('renders correctly, process button click', async () => {
    const { container } = renderReportHeader(defaultProps);

    expect(container).toBeTruthy();
    expect(screen.getByText('Activity 123')).toBeInTheDocument();
    expect(screen.getByText('Download Latest Report')).toBeInTheDocument();

    expect(
      screen.getByLabelText('Please configure the report server to download the report.'),
    ).toBeInTheDocument();
  });

  test('renders correctly with disabled button', async () => {
    renderReportHeader(defaultProps);
    const downloadButton = screen.getByRole('button');

    expect(downloadButton).toBeDisabled();
  });
});
