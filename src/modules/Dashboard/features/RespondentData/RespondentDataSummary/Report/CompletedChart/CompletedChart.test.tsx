import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import * as useDatavizFiltersHook from '../../hooks/useDatavizFilters';
import { CompletedChart } from './CompletedChart';
import { CompletedChartProps } from './CompletedChart.types';

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    watch: () => vi.fn(),
  }),
}));

jest.mock('chartjs-adapter-date-fns', () => ({}));

const dataTestId = 'completed-chart';

const renderComponent = (props?: Partial<CompletedChartProps>) =>
  renderWithProviders(
    <CompletedChart
      completions={[]}
      versions={[]}
      isFlow={false}
      data-testid={dataTestId}
      {...props}
    />,
  );

const checkHeadlineAndChart = (headlineText: string) => {
  const headline = screen.getByTestId(`${dataTestId}-headline`);
  expect(headline).toBeInTheDocument();
  expect(within(headline).getByText(headlineText)).toBeInTheDocument();
  expect(screen.getByTestId(`${dataTestId}-scatter-chart`)).toBeInTheDocument();
};

const hoverTooltip = async () => {
  const tooltip = screen.getByTestId(`${dataTestId}-tooltip`);
  expect(tooltip).toBeInTheDocument();

  await userEvent.hover(tooltip);
};

describe('CompletedChart', () => {
  beforeEach(() => {
    vi.spyOn(useDatavizFiltersHook, 'useDatavizFilters').mockReturnValue({
      minDate: new Date('2023-12-27'),
      maxDate: new Date('2023-12-30'),
      filteredVersions: [],
    });
  });

  test('renders component correctly for Activity completions', async () => {
    renderComponent();

    checkHeadlineAndChart('Activity Completed');
    await hoverTooltip();

    await waitFor(() => {
      expect(
        screen.getByText('The respondent completed the Activity at these times'),
      ).toBeInTheDocument();
    });
  });

  test('renders component correctly for Activity Flow completions', async () => {
    renderComponent({ isFlow: true });

    checkHeadlineAndChart('Activity Flow Completed');
    await hoverTooltip();

    await waitFor(() => {
      expect(
        screen.getByText('The respondent completed the Activity Flow at these times'),
      ).toBeInTheDocument();
    });
  });
});
