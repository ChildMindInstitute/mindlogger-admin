import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import { Svg } from 'shared/components/Svg';

import { Actions } from './Actions';

const defaultProps = {
  items: [
    {
      icon: <Svg id="remove-from-folder" />,
      action: vi.fn(),
      tooltipTitle: 'Action 1',
      isDisplayed: true,
      'data-testid': 'data-testid-action-1',
    },
    {
      icon: <Svg id="duplicate" />,
      action: vi.fn(),
      tooltipTitle: 'Action 2',
      isDisplayed: false,
      'data-testid': 'data-testid-action-2',
    },
    {
      icon: <Svg id="trash" />,
      action: vi.fn(),
      tooltipTitle: 'Action 3',
      isDisplayed: true,
      disabled: true,
      'data-testid': 'data-testid-action-3',
    },
  ],
  context: {},
};

describe('Actions Component', () => {
  test('renders the component with default props', () => {
    render(<Actions {...defaultProps} />);

    expect(screen.getByTestId('data-testid-action-1')).toBeInTheDocument();
    expect(screen.queryByTestId('data-testid-action-2')).toBeNull();
    expect(screen.getByTestId('data-testid-action-3')).toBeInTheDocument();
  });

  test('invokes the action on button click', () => {
    render(<Actions {...defaultProps} />);
    const button = screen.getByTestId('data-testid-action-1');
    fireEvent.click(button);

    expect(defaultProps.items[0].action).toHaveBeenCalled();
  });

  test('tooltip is displayed when for hover on the button', async () => {
    render(<Actions {...defaultProps} />);
    const button = screen.getByTestId('data-testid-action-1');
    fireEvent.mouseOver(button);

    await waitFor(() => {
      expect(screen.getByText('Action 1')).toBeInTheDocument();
    });
  });

  test('disables buttons when needed', () => {
    render(<Actions {...defaultProps} />);
    const disabledButton = screen.getByTestId('data-testid-action-3');
    expect(disabledButton).toBeDisabled();
  });
});
