import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { FeedbackReviewerHeaderProps } from './FeedbackReviewerHeader.types';
import { FeedbackReviewerHeader } from './FeedbackReviewerHeader';

const mockedOnToggleVisibility = jest.fn();
const mockedOnRemove = jest.fn();
const mockedOnEdit = jest.fn();
const dataTestid = 'reviewer-header';
const renderComponent = (props?: Partial<FeedbackReviewerHeaderProps>) =>
  renderWithProviders(
    <FeedbackReviewerHeader
      isReviewOpen={false}
      reviewerName="John Doe"
      hasReview={true}
      submitDate="2024-04-08T10:00:00"
      onToggleVisibilityClick={mockedOnToggleVisibility}
      onRemoveClick={mockedOnRemove}
      onEditClick={mockedOnEdit}
      hasEditAndRemove={true}
      data-testid={dataTestid}
      {...props}
    />,
  );

describe('FeedbackReviewerHeader', () => {
  test('should render correctly if has review, remove, and edit buttons', async () => {
    renderComponent();

    const collapseButton = screen.getByTestId(`${dataTestid}-collapse`);
    const removeButton = screen.getByTestId(`${dataTestid}-answers-remove`);
    const editButton = screen.getByTestId(`${dataTestid}-answers-edit`);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(collapseButton).toBeInTheDocument();
    expect(removeButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestid}-lock`)).not.toBeInTheDocument();
    expect(screen.getByText('Submitted: Apr 08, 2024, 10:00')).toBeInTheDocument();

    await userEvent.click(collapseButton);
    expect(mockedOnToggleVisibility).toHaveBeenCalled();

    await userEvent.click(removeButton);
    expect(mockedOnRemove).toHaveBeenCalled();

    await userEvent.click(editButton);
    expect(mockedOnEdit).toHaveBeenCalled();
  });

  test('renders lock icon for user with no permission to view data', async () => {
    renderComponent({ hasReview: false });

    const lock = screen.getByTestId(`${dataTestid}-lock`);
    expect(lock).toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestid}-collapse`)).not.toBeInTheDocument();

    await userEvent.hover(lock);

    await waitFor(() => {
      expect(screen.getByText('You do not have permission to view this data')).toBeInTheDocument();
    });
  });

  test('not renders remove and edit buttons for if hasEditAndRemove is false', () => {
    renderComponent({ hasEditAndRemove: false });

    expect(screen.queryByTestId(`${dataTestid}-answers-remove`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestid}-answers-edit`)).not.toBeInTheDocument();
  });
});
