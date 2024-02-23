import { fireEvent, render, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { FileSizeExceededBanner } from './FileSizeExceededBanner';

const props = {
  onClose: jest.fn(),
  size: 100,
};

describe('FileSizeExceededBanner', () => {
  test('should render', () => {
    renderWithProviders(<FileSizeExceededBanner {...props} />);

    expect(screen.getByTestId('error-banner')).toBeInTheDocument();
    expect(
      screen.getByText(`File is too big. Please upload a file less than ${props.size} B.`),
    ).toBeInTheDocument();
  });

  test('clicking the close button hides the banner', () => {
    render(<FileSizeExceededBanner {...props} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
