import { render, screen, fireEvent } from '@testing-library/react';
import useWindowFocus from 'use-window-focus';

import { Banner } from './Banner';

const mockOnClose = jest.fn();

const props = {
  children: 'Test banner',
  onClose: mockOnClose,
  duration: 5000,
};

jest.mock('use-window-focus');

describe('Banner', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should render component', () => {
    render(<Banner {...props} />);

    expect(screen.queryByText(props.children)).toBeVisible();
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeVisible();
    expect(closeButton).toHaveAccessibleName('Close');
  });

  test('clicking the close button calls onClose callback', () => {
    render(<Banner {...props} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('banner auto-closes after 5 seconds if window in focus', () => {
    jest.useFakeTimers();
    (useWindowFocus as jest.Mock).mockReturnValue(true);

    render(<Banner {...props} />);

    jest.advanceTimersByTime(props.duration);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('banner does not auto-close if window unfocused', () => {
    jest.useFakeTimers();
    (useWindowFocus as jest.Mock).mockReturnValue(false);

    render(<Banner {...props} />);

    jest.advanceTimersByTime(props.duration);
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});