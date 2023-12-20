import { render, screen } from '@testing-library/react';
import { ChartTooltip } from './ChartTooltip';

const dataTestid = 'bar-chart';

const props = {
  data: {
    backgroundColor: 'blue',
    label: 'Example Label',
    value: 42,
  },
  onMouseEnter: jest.fn(),
  onMouseLeave: jest.fn(),
  'data-testid': dataTestid,
};

describe('ChartTooltip', () => {
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
