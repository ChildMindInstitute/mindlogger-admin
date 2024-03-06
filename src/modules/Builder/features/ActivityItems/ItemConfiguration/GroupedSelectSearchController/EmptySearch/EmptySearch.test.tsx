import { render, screen } from '@testing-library/react';

import { EmptySearch } from './EmptySearch';

describe('EmptySearch', () => {
  const defaultProps = {
    description: 'No match was found',
    'data-testid': 'empty-search',
  };

  test('renders EmptySearch component with correct description and data-testid attribute', () => {
    render(<EmptySearch {...defaultProps} />);

    const emptySearch = screen.getByTestId('empty-search');
    expect(emptySearch).toBeInTheDocument();
    const description = screen.getByText('No match was found');
    expect(description).toBeInTheDocument();
  });
});
