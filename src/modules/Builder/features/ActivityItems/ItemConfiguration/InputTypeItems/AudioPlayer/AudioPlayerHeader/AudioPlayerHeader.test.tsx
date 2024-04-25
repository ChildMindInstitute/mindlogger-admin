import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { AudioPlayerHeader } from './AudioPlayerHeader';

describe('AudioPlayerHeader component', () => {
  const media = {
    url: 'url',
    name: 'name',
    uploaded: true,
  };

  test('renders nothing when open prop is true', () => {
    const { container } = renderWithProviders(<AudioPlayerHeader open media={media} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders nothing when media prop is nullable', () => {
    const { container } = renderWithProviders(<AudioPlayerHeader open={false} media={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders media name and check icon when open is false and media is non-nullable', () => {
    const { container } = renderWithProviders(<AudioPlayerHeader open={false} media={media} />);
    expect(screen.getByText('name')).toBeInTheDocument();
    const svgCheck = container.querySelector('svg.svg-check');
    expect(svgCheck).toBeInTheDocument();
  });
});
