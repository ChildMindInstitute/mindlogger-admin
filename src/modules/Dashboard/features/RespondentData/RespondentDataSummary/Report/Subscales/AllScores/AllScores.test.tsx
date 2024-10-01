import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { AllScores } from './AllScores';

const data = {
  subscales: [
    {
      activityCompletions: [],
      name: 'sum',
    },
    {
      activityCompletions: [],
      name: 'average',
    },
  ],
};
const latestFinalScore = 23;
const frequency = 2;

const dataTestId = 'all-scores';

jest.mock('../../Charts/LineChart', () => ({
  SubscaleLineChart: () => <div data-testid={`${dataTestId}-subscale-line-chart`} />,
}));

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

describe('AllScores component', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableCahmiSubscaleScoring: false,
      },
      resetLDContext: jest.fn(),
    });
  });

  test('renders component with correct data and frequency, without latestFinalScore', () => {
    renderWithProviders(
      <AllScores
        data={data}
        latestFinalScore={null}
        frequency={frequency}
        versions={[]}
        data-testid={dataTestId}
      />,
    );

    expect(screen.getByText('Subscale Scores')).toBeInTheDocument();
    expect(
      screen.queryByTestId(`${dataTestId}-latest-final-subscale-score`),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestId}-frequency`)).toBeInTheDocument();
    expect(screen.getByText(`Frequency: ${frequency}`)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestId}-subscale-line-chart`)).toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestId}-line-chart-legend`)).not.toBeInTheDocument();
  });

  test('Renders line chart legend when enableCahmiSubscaleScoring is true', async () => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableCahmiSubscaleScoring: true,
      },
      resetLDContext: jest.fn(),
    });

    renderWithProviders(
      <AllScores
        data={data}
        latestFinalScore={null}
        frequency={frequency}
        versions={[]}
        data-testid={dataTestId}
      />,
    );

    expect(screen.getByText('Subscale Scores')).toBeInTheDocument();
    expect(
      screen.queryByTestId(`${dataTestId}-latest-final-subscale-score`),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestId}-frequency`)).toBeInTheDocument();
    expect(screen.getByText(`Frequency: ${frequency}`)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestId}-subscale-line-chart`)).toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestId}-line-chart-legend`)).toBeInTheDocument();
  });

  test('renders component with correct data and frequency, with latestFinalScore', () => {
    renderWithProviders(
      <AllScores
        data={data}
        latestFinalScore={latestFinalScore}
        frequency={frequency}
        versions={[]}
        data-testid={dataTestId}
      />,
    );

    expect(screen.getByText('Subscale Scores')).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestId}-subscale-line-chart`)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestId}-latest-final-subscale-score`)).toBeInTheDocument();
    expect(
      screen.getByText(`Latest Final Subscale Score: ${latestFinalScore}`),
    ).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestId}-frequency`)).toBeInTheDocument();
    expect(screen.getByText(`Frequency: ${frequency}`)).toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestId}-line-chart-legend`)).not.toBeInTheDocument();
  });

  test('renders nothing when data.subscales is empty', () => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableCahmiSubscaleScoring: true,
      },
      resetLDContext: jest.fn(),
    });

    renderWithProviders(
      <AllScores
        data={{ subscales: [] }}
        latestFinalScore={null}
        frequency={0}
        versions={[]}
        data-testid={dataTestId}
      />,
    );

    expect(screen.queryByText('Subscale Scores')).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestId}-subscale-line-chart`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestId}-line-chart-legend`)).not.toBeInTheDocument();
  });
});
