import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { RemoveReviewPopup } from './RemoveReviewPopup';
import { RemoveReviewPopupProps } from './RemoveReviewPopup.types';

const dataTestid = 'respondents-feedback-review-remove-popup';
const mockedOnClose = vi.fn();
const mockedOnSubmit = vi.fn();

const renderComponent = (props?: Partial<RemoveReviewPopupProps>) => {
  renderWithProviders(
    <RemoveReviewPopup
      popupVisible={true}
      error={null}
      onClose={mockedOnClose}
      onSubmit={mockedOnSubmit}
      isLoading={false}
      {...props}
    />,
  );
};

describe('Remove Review Popup', () => {
  test('the component is not rendered when property popupVisible is false', () => {
    renderComponent({ popupVisible: false });

    expect(screen.queryByTestId(dataTestid)).not.toBeInTheDocument();
  });

  test('renders the component for popupVisible = true and checks callbacks are called when buttons are clicked', async () => {
    renderComponent();

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
    expect(screen.getByText('Remove Review')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to remove your responses?')).toBeInTheDocument();

    const closeButton = screen.getByTestId(`${dataTestid}-close-button`);
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);

    expect(mockedOnClose).toHaveBeenCalled();

    const submitButton = screen.getByTestId(`${dataTestid}-submit-button`);
    expect(submitButton).toBeInTheDocument();
    await userEvent.click(submitButton);

    expect(mockedOnSubmit).toHaveBeenCalled();

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton);

    expect(mockedOnClose).toHaveBeenCalled();
  });

  test('renders error', () => {
    renderComponent({ error: 'some error text' });

    expect(screen.getByText('some error text')).toBeInTheDocument();
  });
});
