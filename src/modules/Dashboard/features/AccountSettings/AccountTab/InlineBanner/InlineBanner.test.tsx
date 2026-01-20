import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';

import { InlineBanner } from './InlineBanner';

describe('InlineBanner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should render with message', () => {
    render(<InlineBanner message="Test message" duration={5000} />);

    expect(screen.getByTestId('inline-mfa-banner')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('should call onClose after duration', () => {
    const onClose = vi.fn();

    render(<InlineBanner message="Test message" duration={1000} onClose={onClose} />);

    expect(screen.getByTestId('inline-mfa-banner')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('should hide banner after duration and onClose is called', () => {
    const onClose = vi.fn();

    const { rerender } = render(
      <InlineBanner message="Test message" duration={1000} onClose={onClose} />,
    );

    expect(screen.getByTestId('inline-mfa-banner')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);

    // Simulate parent component re-rendering after banner state update
    rerender(<></>);

    expect(screen.queryByTestId('inline-mfa-banner')).not.toBeInTheDocument();
  });

  test('should not auto-hide if no duration provided', () => {
    render(<InlineBanner message="Test message" />);

    expect(screen.getByTestId('inline-mfa-banner')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(screen.getByTestId('inline-mfa-banner')).toBeInTheDocument();
  });

  test('should not auto-hide if no onClose callback provided', () => {
    render(<InlineBanner message="Test message" duration={1000} />);

    expect(screen.getByTestId('inline-mfa-banner')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId('inline-mfa-banner')).toBeInTheDocument();
  });
});
