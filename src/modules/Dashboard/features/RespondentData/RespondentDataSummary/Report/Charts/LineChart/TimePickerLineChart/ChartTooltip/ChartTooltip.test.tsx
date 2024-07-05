// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ChartTooltip } from './ChartTooltip';

const dataTestid = 'multi-scatter-chart';

const props = {
  data: [
    {
      x: new Date(2023, 11, 20, 14, 55), // Dec 20, 14:55
      y: new Date(2023, 11, 20, 15, 40), // 15:40
    },
    {
      x: new Date(2023, 11, 20, 15, 30), // Dec 20, 15:30
      y: new Date(2023, 11, 20, 7, 35), // 07:35
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

    const regex = new RegExp(`${dataTestid}-tooltip-item-\\d+$`);
    const tooltipItems = screen.queryAllByTestId(regex);
    expect(tooltipItems).toHaveLength(2);

    expect(screen.getByText('2 responses')).toBeInTheDocument();
    expect(screen.getByText('15:40')).toBeInTheDocument();
    expect(screen.getByText('Dec 20, 14:55')).toBeInTheDocument();
    expect(screen.getByText('07:35')).toBeInTheDocument();
    expect(screen.getByText('Dec 20, 15:30')).toBeInTheDocument();
  });
});
