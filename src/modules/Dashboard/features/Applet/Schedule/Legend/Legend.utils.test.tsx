import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { getTitle } from './Legend.utils';

describe('getTitle', () => {
  test('returns name when isFlow is falsy', () => {
    const name = 'Title';
    const title = getTitle(name);
    expect(title).toBe(name);
  });

  test('returns SVG and name when isFlow is true', () => {
    const name = 'Flow Title';
    const isFlow = true;
    const title = getTitle(name, isFlow) as JSX.Element;
    renderWithProviders(title);

    const svg = document.querySelector('svg');
    expect(svg?.getAttribute('class')).toBe('svg-flow ');
    expect(screen.getByText(name)).toBeInTheDocument();
  });
});
