// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { render, screen, fireEvent } from '@testing-library/react';
import { ChartTooltipContainer } from './ChartTooltipContainer';

const dataTestid = 'example';

const onMouseEnter = jest.fn();
const onMouseLeave = jest.fn();
const props = {
  'data-testid': dataTestid,
  onMouseEnter,
  onMouseLeave,
};

describe('ChartTooltipContainer', () => {
  test('renders component correctly', () => {
    render(
      <ChartTooltipContainer {...props}>
        <>Child component</>
      </ChartTooltipContainer>,
    );

    const tooltipWrapper = screen.getByTestId(`${dataTestid}-tooltip-wrapper`);

    fireEvent.mouseEnter(tooltipWrapper);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(tooltipWrapper);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});
