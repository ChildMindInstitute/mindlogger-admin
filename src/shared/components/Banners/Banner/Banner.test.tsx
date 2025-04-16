import { render, screen, fireEvent } from '@testing-library/react';

import { Banner } from './Banner';

const mockOnClose = vi.fn();
const mockUseWindowFocus = vi.fn();

const props = {
  children: 'Test banner',
  onClose: mockOnClose,
  duration: 5000,
};

jest.mock('shared/hooks/useWindowFocus', () => ({
  useWindowFocus: () => mockUseWindowFocus(),
}));

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
    mockUseWindowFocus.mockReturnValue(true);

    render(<Banner {...props} />);

    jest.advanceTimersByTime(props.duration + 1000);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('banner does not auto-close if window unfocused', () => {
    jest.useFakeTimers();
    mockUseWindowFocus.mockReturnValue(false);

    render(<Banner {...props} />);

    jest.advanceTimersByTime(props.duration + 1000);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test.each`
    severity     | testId
    ${'success'} | ${'success-banner'}
    ${'info'}    | ${'info-banner'}
    ${'warning'} | ${'warning-banner'}
    ${'error'}   | ${'error-banner'}
  `('has test ID that matches severity $severity', ({ severity, testId }) => {
    render(<Banner {...props} severity={severity} />);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
});
