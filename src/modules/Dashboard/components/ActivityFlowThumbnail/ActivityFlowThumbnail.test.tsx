import React from 'react';
import { render } from '@testing-library/react';

import { Activity } from 'redux/modules';

import { ActivityFlowThumbnail } from './ActivityFlowThumbnail';

describe('ActivityFlowThumbnail', () => {
  it('renders a thumbnail with no activities without crashing', () => {
    const { container } = render(<ActivityFlowThumbnail activities={[]} />);
    expect(container).toBeInTheDocument();
  });

  it('renders the correct number of images', () => {
    const activities = [
      { image: 'image1.png' },
      { image: 'image2.png' },
      { image: 'image3.png' },
      { image: 'image4.png' },
    ] as Activity[];

    const { getAllByTestId } = render(<ActivityFlowThumbnail activities={activities} />);
    const images = getAllByTestId('activity-thumbnail');
    expect(images).toHaveLength(4);
  });

  it('renders item count when there are more than 4 activities', () => {
    const activities = [
      { image: 'image1.png' },
      { image: 'image2.png' },
      { image: 'image3.png' },
      { image: 'image4.png' },
      { image: 'image5.png' },
    ] as Activity[];

    const { getByText } = render(<ActivityFlowThumbnail activities={activities} />);
    expect(getByText('5')).toBeInTheDocument();
  });

  it('does not render item count when there are 4 or fewer activities', () => {
    const activities = [
      { image: 'image1.png' },
      { image: 'image2.png' },
      { image: 'image3.png' },
      { image: 'image4.png' },
    ] as Activity[];

    const { queryByText } = render(<ActivityFlowThumbnail activities={activities} />);
    expect(queryByText('4')).not.toBeInTheDocument();
  });

  it('handles activities without images gracefully', () => {
    const activities = [
      { image: 'image1.png' },
      { image: null },
      { image: 'image3.png' },
    ] as Activity[];

    const { getAllByTestId } = render(<ActivityFlowThumbnail activities={activities} />);
    const images = getAllByTestId('activity-thumbnail');
    expect(images).toHaveLength(2);
  });

  it('accepts an array of string images instead of activities', () => {
    const activities = ['image1.png', 'image2.png', 'image3.png', 'image4.png'];

    const { getAllByTestId } = render(<ActivityFlowThumbnail activities={activities} />);
    const images = getAllByTestId('activity-thumbnail');
    expect(images).toHaveLength(4);
  });
});
