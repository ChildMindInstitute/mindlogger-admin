import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { AddReview } from './AddReview';

const mockOnAddReview = jest.fn();
const renderComponent = () =>
  renderWithProviders(<AddReview userName="John Doe" onAddReview={mockOnAddReview} />);

describe('AddReview component', () => {
  test('renders correctly with user name', () => {
    renderComponent();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Add Review')).toBeInTheDocument();
  });

  test('calls onAddReview when button is clicked', async () => {
    renderComponent();
    await userEvent.click(screen.getByText('Add Review'));

    expect(mockOnAddReview).toHaveBeenCalledTimes(1);
  });
});
