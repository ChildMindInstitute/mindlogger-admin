import { render, screen, fireEvent } from '@testing-library/react';

import { NavigationEyebrow } from './NavigationEyebrow';

describe('NavigationEyebrow', () => {
  test('handle click event', () => {
    const handleClick = vi.fn();
    render(<NavigationEyebrow title="Clickable NavigationEyebrow" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Clickable NavigationEyebrow'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  test('renders subtitle', () => {
    render(<NavigationEyebrow title="NavigationEyebrow" subtitle={'Subtitle'} />);

    const subtitleText = screen.getByText('Subtitle');
    expect(subtitleText).toBeInTheDocument();
  });
});
