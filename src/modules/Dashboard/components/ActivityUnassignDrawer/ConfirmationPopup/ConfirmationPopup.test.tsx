import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ConfirmationPopup } from './ConfirmationPopup';

const mockedTestId = 'test-id';
const mockedOnClose = vi.fn();
const mockedOnConfirm = vi.fn();
const mockedTitle = 'title';
const mockedBody = 'body';

describe('ConfirmationPopup', () => {
  test('renders the popup correctly', async () => {
    renderWithProviders(
      <ConfirmationPopup
        isVisible={true}
        isLoading={false}
        onClose={mockedOnClose}
        onConfirm={mockedOnConfirm}
        data-testid={mockedTestId}
        title={mockedTitle}
        body={mockedBody}
      />,
    );
    expect(screen.getByTestId(mockedTestId)).toBeInTheDocument();
    expect(screen.getByText(mockedTitle)).toBeInTheDocument();
    expect(screen.getByText(mockedBody)).toBeInTheDocument();
  });

  test('clicking default submit button or close button closes the popup', async () => {
    renderWithProviders(
      <ConfirmationPopup
        isVisible={true}
        isLoading={false}
        onClose={mockedOnClose}
        onConfirm={mockedOnConfirm}
        title={mockedTitle}
        body={mockedBody}
        data-testid={mockedTestId}
      />,
    );
    const submitButton = screen.getByTestId(`${mockedTestId}-submit-button`);
    await userEvent.click(submitButton);
    expect(mockedOnConfirm).toHaveBeenCalled();

    const closeButton = screen.getByTestId(`${mockedTestId}-close-button`);
    await userEvent.click(closeButton);
    expect(mockedOnClose).toHaveBeenCalled();
  });
});
