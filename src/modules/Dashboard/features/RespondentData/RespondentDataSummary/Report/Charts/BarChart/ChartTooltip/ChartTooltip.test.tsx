// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { render, screen } from '@testing-library/react';

import { ChartTooltip } from './ChartTooltip';

const dataTestid = 'bar-chart';

const props = {
  data: {
    backgroundColor: 'blue',
    label: 'Example Label',
    value: 42,
  },
  'data-testid': dataTestid,
};

describe('ChartTooltip', () => {
  test('renders component correctly when props data is null', () => {
    render(<ChartTooltip data={null} />);

    const tooltip = screen.queryByTestId(`${dataTestid}-tooltip`);
    expect(tooltip).not.toBeInTheDocument();
  });

  test('renders component correctly', () => {
    render(<ChartTooltip {...props} />);

    const tooltip = screen.getByTestId(`${dataTestid}-tooltip`);
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByText('Example Label: 42')).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-tooltip-background`)).toHaveStyle({
      backgroundColor: 'blue',
    });
  });
});
