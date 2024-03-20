import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils';

import { ExportSchedulePopup } from './ExportSchedulePopup';

const dataTestid = 'export-schedule-popup';
const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

const mockProps = {
  open: true,
  onClose: mockOnClose,
  onSubmit: mockOnSubmit,
  scheduleTableRows: [
    {
      activityName: { content: () => 'Activity 1', value: 'Activity 1' },
    },
  ],
  'data-testid': dataTestid,
};

describe('ExportSchedulePopup', () => {
  test('render component correctly with individual schedule, test export button click', async () => {
    renderWithProviders(<ExportSchedulePopup {...mockProps} respondentName="Jane Doe" />);

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
    const title = screen.getByText('Export Individual Schedule');
    expect(title).toBeInTheDocument();
    const description = screen.getByTestId(`${dataTestid}-description`);
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(
      'The current individual schedule of respondent Jane Doe will be exported as a .csv file.',
    );
    expect(screen.getByTestId(`${dataTestid}-table`)).toBeInTheDocument();

    const exportButton = screen.getByTestId(`${dataTestid}-submit-button`);
    expect(exportButton).toBeInTheDocument();
    expect(exportButton).toHaveTextContent('Export');
    await userEvent.click(exportButton);
    expect(mockOnSubmit).toBeCalled();
  });

  test('render component correctly with default schedule, test close button click', async () => {
    renderWithProviders(<ExportSchedulePopup {...mockProps} />);

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
    const title = screen.getByText('Export Default Schedule');
    expect(title).toBeInTheDocument();
    const description = screen.getByTestId(`${dataTestid}-description`);
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(
      'The current default schedule will be exported as a .csv file.',
    );
    expect(screen.getByTestId(`${dataTestid}-table`)).toBeInTheDocument();

    const closeButton = screen.getByTestId(`${dataTestid}-close-button`);
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(mockOnClose).toBeCalled();
  });
});
