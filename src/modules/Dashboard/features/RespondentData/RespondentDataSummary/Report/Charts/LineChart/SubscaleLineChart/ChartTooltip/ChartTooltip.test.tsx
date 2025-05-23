import { render, screen, within } from '@testing-library/react';

import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { ChartTooltip } from './ChartTooltip';
import { ChartTooltipProps } from './ChartTooltip.types';
import { TooltipData } from '../SubscaleLineChart.types';

const dataTestid = 'subscale-line-chart';

const props: ChartTooltipProps = {
  dataPoints: [
    {
      date: new Date(2023, 11, 20, 14, 55), // Dec 20, 14:55
      backgroundColor: 'blue',
      label: 'Example 1',
      value: 42,
      optionText: 'Mocked Option Text',
      severity: null,
    },
    {
      date: new Date(2023, 11, 20, 17, 20), // Dec 20, 17:20
      backgroundColor: 'yellow',
      label: 'Example 2',
      value: 7,
      optionText: '',
      severity: null,
    },
  ],
  'data-testid': dataTestid,
};

vi.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: vi.fn(),
}));

const mockUseFeatureFlags = vi.mocked(useFeatureFlags);

jest.mock('./ChartTooltip.styles', () => ({
  ...jest.requireActual('./ChartTooltip.styles'),
  StyledMdPreview: ({
    modelValue,
    'data-testid': dataTestid,
  }: {
    modelValue: string;
    'data-testid': string;
  }) => <div data-testid={dataTestid}>{modelValue}</div>,
}));

describe('ChartTooltip', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableCahmiSubscaleScoring: false,
      },
      resetLDContext: vi.fn(),
    });
  });

  test('renders component correctly when props data is null', () => {
    render(<ChartTooltip dataPoints={null} />);
    const tooltip = screen.queryByTestId(`${dataTestid}-tooltip`);
    expect(tooltip).toBeNull(); // Using Jest's default matcher to check if the element is not present
  });

  test('renders component correctly', () => {
    render(<ChartTooltip {...props} />);
    const tooltip = screen.queryByTestId(`${dataTestid}-tooltip`);
    expect(tooltip).not.toBeNull();

    const regex = new RegExp(`${dataTestid}-tooltip-item-\\d+$`);
    const tooltipItems = screen.queryAllByTestId(regex);
    expect(tooltipItems.length).toBe(2);

    const itemContainer0 = screen.getByTestId(`${dataTestid}-tooltip-item-0`);
    expect(itemContainer0.textContent).toContain('Example 1: 42');
    const mdEditor0 = within(itemContainer0).queryByTestId(
      `${dataTestid}-tooltip-item-0-md-preview`,
    );
    expect(mdEditor0).not.toBeNull();
    expect(itemContainer0.textContent).toContain('Mocked Option Text');
    expect(itemContainer0.textContent).toContain('Dec 20, 14:55');

    expect(screen.queryByTestId(`${dataTestid}-severity-0`)).toBeNull();

    const itemContainer1 = screen.getByTestId(`${dataTestid}-tooltip-item-1`);
    expect(itemContainer1.textContent).toContain('Example 2: 7');
    const mdEditor1 = within(itemContainer1).queryByTestId(
      `${dataTestid}-tooltip-item-1-md-preview`,
    );
    expect(mdEditor1).toBeNull();
    expect(itemContainer1.textContent).toContain('Dec 20, 17:20');

    expect(screen.queryByTestId(`${dataTestid}-severity-1`)).toBeNull();
  });

  test('renders severity info when enableCahmiSubscaleScoring is true', () => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableCahmiSubscaleScoring: true,
      },
      resetLDContext: vi.fn(),
    });

    const modifiedDataPoints: TooltipData[] =
      props.dataPoints?.map((dataPoint) => ({
        ...dataPoint,
        severity: 'Mild',
      })) || [];

    render(<ChartTooltip {...props} dataPoints={modifiedDataPoints} />);
    const tooltip = screen.queryByTestId(`${dataTestid}-tooltip`);
    expect(tooltip).not.toBeNull();

    const regex = new RegExp(`${dataTestid}-tooltip-item-\\d+$`);
    const tooltipItems = screen.queryAllByTestId(regex);
    expect(tooltipItems.length).toBe(2);

    const itemContainer0 = screen.getByTestId(`${dataTestid}-tooltip-item-0`);
    expect(itemContainer0.textContent).toContain('Example 1: 42');
    const mdEditor0 = within(itemContainer0).queryByTestId(
      `${dataTestid}-tooltip-item-0-md-preview`,
    );
    expect(mdEditor0).not.toBeNull();
    expect(itemContainer0.textContent).toContain('Mocked Option Text');
    expect(itemContainer0.textContent).toContain('Dec 20, 14:55');

    const severity0 = screen.queryByTestId(`${dataTestid}-severity-0`);
    expect(severity0).not.toBeNull();
    expect(severity0?.textContent).toEqual('Severity: Mild');

    const itemContainer1 = screen.getByTestId(`${dataTestid}-tooltip-item-1`);
    expect(itemContainer1.textContent).toContain('Example 2: 7');
    const mdEditor1 = within(itemContainer1).queryByTestId(
      `${dataTestid}-tooltip-item-1-md-preview`,
    );
    expect(mdEditor1).toBeNull();
    expect(itemContainer1.textContent).toContain('Dec 20, 17:20');

    const severity1 = screen.queryByTestId(`${dataTestid}-severity-1`);
    expect(severity1).not.toBeNull();
    expect(severity1?.textContent).toEqual('Severity: Mild');
  });

  test('does not render severity info when it is not provided', () => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableCahmiSubscaleScoring: true,
      },
      resetLDContext: vi.fn(),
    });

    render(<ChartTooltip {...props} />);
    const tooltip = screen.queryByTestId(`${dataTestid}-tooltip`);
    expect(tooltip).not.toBeNull();

    const regex = new RegExp(`${dataTestid}-tooltip-item-\\d+$`);
    const tooltipItems = screen.queryAllByTestId(regex);
    expect(tooltipItems.length).toBe(2);

    const itemContainer0 = screen.getByTestId(`${dataTestid}-tooltip-item-0`);
    expect(itemContainer0.textContent).toContain('Example 1: 42');
    const mdEditor0 = within(itemContainer0).queryByTestId(
      `${dataTestid}-tooltip-item-0-md-preview`,
    );
    expect(mdEditor0).not.toBeNull();
    expect(itemContainer0.textContent).toContain('Mocked Option Text');
    expect(itemContainer0.textContent).toContain('Dec 20, 14:55');

    expect(screen.queryByTestId(`${dataTestid}-severity-0`)).toBeNull();

    const itemContainer1 = screen.getByTestId(`${dataTestid}-tooltip-item-1`);
    expect(itemContainer1.textContent).toContain('Example 2: 7');
    const mdEditor1 = within(itemContainer1).queryByTestId(
      `${dataTestid}-tooltip-item-1-md-preview`,
    );
    expect(mdEditor1).toBeNull();
    expect(itemContainer1.textContent).toContain('Dec 20, 17:20');

    expect(screen.queryByTestId(`${dataTestid}-severity-1`)).toBeNull();
  });
});
