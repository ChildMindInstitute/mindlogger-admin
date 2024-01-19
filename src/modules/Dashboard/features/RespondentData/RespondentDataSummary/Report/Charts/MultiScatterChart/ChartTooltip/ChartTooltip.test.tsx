// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { ChartTooltip } from './ChartTooltip';

const dataTestid = 'multi-scatter-chart';

const props = {
  data: [
    {
      response: {
        x: 1,
        y: 1,
        answerId: '773d904e-15a0-4702-b53b-d3f3e2d8be71',
      },
      parsed: {
        x: 1703089235000, // Dec 20 2023, 16:20
      },
    },
    {
      response: {
        x: 1,
        y: 1.5,
        answerId: '914a904b-50b4-0087-e21a-b1f3a9d4be00',
      },
      parsed: {
        x: 1703089800000, // Dec 20 2023, 16:30
      },
    },
  ],
  'data-testid': dataTestid,
};

describe('ChartTooltip', () => {
  test('renders component correctly when props data is null', () => {
    renderWithProviders(<ChartTooltip data={null} />);

    const tooltip = screen.queryByTestId(`${dataTestid}-tooltip`);
    expect(tooltip).not.toBeInTheDocument();
  });

  test('renders component correctly', () => {
    renderWithProviders(<ChartTooltip {...props} />);

    const tooltip = screen.getByTestId(`${dataTestid}-tooltip`);
    expect(tooltip).toBeInTheDocument();

    expect(screen.getByText('2 responses')).toBeInTheDocument();
    expect(screen.getByText('Dec 20, 16:20')).toBeInTheDocument();
    expect(screen.getByText('Dec 20, 16:30')).toBeInTheDocument();
  });
});
