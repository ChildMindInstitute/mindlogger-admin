import { render, fireEvent, screen } from '@testing-library/react';

import { ActivityFlowHeader } from '.';

const mockOnAddActivityFlow = jest.fn();
const renderComponent = () =>
  render(
    <ActivityFlowHeader headerProps={{ onAddActivityFlow: mockOnAddActivityFlow }}>
      <div data-testid="test-children"></div>
    </ActivityFlowHeader>,
  );

describe('ActivityFlowHeader', () => {
  test('renders children correctly', () => {
    renderComponent();

    expect(screen.getByTestId('test-children')).toBeInTheDocument();
  });

  test('calls onAddActivityFlow on button click', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('builder-activity-flows-add'));
    expect(mockOnAddActivityFlow).toHaveBeenCalled();
  });
});
