import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { AssessmentBanner } from './AssessmentBanner';

const mockOnClose = jest.fn();

describe('AssessmentBanner component', () => {
  test('renders correctly when banner is visible', () => {
    renderWithProviders(<AssessmentBanner isBannerVisible={true} onClose={mockOnClose} />);
    expect(screen.getByTestId('assessment-banner')).toBeInTheDocument();
    expect(
      screen.getByText('A new version of the assessment is now available.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'To review using the new version, please remove your current submission below and proceed with the review again.',
      ),
    ).toBeInTheDocument();
  });

  test('does not show when banner is not visible', () => {
    renderWithProviders(<AssessmentBanner isBannerVisible={false} onClose={mockOnClose} />);
    expect(screen.queryByTestId('assessment-banner')).toHaveClass('MuiCollapse-hidden');
  });

  test('calls onClose when close button is clicked', async () => {
    const { getByTestId } = renderWithProviders(
      <AssessmentBanner isBannerVisible={true} onClose={mockOnClose} />,
    );
    await userEvent.click(getByTestId('assessment-banner-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
