import { render, screen } from '@testing-library/react';
import { Icons } from 'svgSprite';

import { ActivityListItemCounter } from './ActivityListItemCounter';

describe('ActivityListItemCounter', () => {
  const defaultProps = {
    icon: 'folder-opened' as Icons,
    label: 'Test Label',
    count: 10,
    isLoading: false,
  };

  it('renders the label and count', () => {
    render(<ActivityListItemCounter {...defaultProps} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders accessibility empty state', () => {
    render(<ActivityListItemCounter {...defaultProps} count={undefined} />);
    expect(screen.getByLabelText('--')).toBeInTheDocument();
  });

  it('renders accessibility loading state', () => {
    render(<ActivityListItemCounter {...defaultProps} isLoading={true} />);
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });
});
