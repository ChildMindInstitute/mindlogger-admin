import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

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

jest.mock('../../Charts/LineChart', () => ({
  SubscaleLineChart: () => <div data-testid="subscale-line-chart" />,
}));

describe('AllScores component', () => {
  test('renders component with correct data and frequency, without latestFinalScore', () => {
    renderWithProviders(<AllScores data={data} latestFinalScore={null} frequency={frequency} versions={[]} />);

    expect(screen.getByText('Subscale Scores')).toBeInTheDocument();
    expect(screen.queryByTestId('latest-final-subscale-score')).not.toBeInTheDocument();
    expect(screen.getByTestId('frequency')).toBeInTheDocument();
    expect(screen.getByText(`Frequency: ${frequency}`)).toBeInTheDocument();
    expect(screen.getByTestId('subscale-line-chart')).toBeInTheDocument();
  });

  test('renders component with correct data and frequency, with latestFinalScore', () => {
    renderWithProviders(
      <AllScores data={data} latestFinalScore={latestFinalScore} frequency={frequency} versions={[]} />,
    );

    expect(screen.getByText('Subscale Scores')).toBeInTheDocument();
    expect(screen.getByTestId('subscale-line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('latest-final-subscale-score')).toBeInTheDocument();
    expect(screen.getByText(`Latest Final Subscale Score: ${latestFinalScore}`)).toBeInTheDocument();
    expect(screen.getByTestId('frequency')).toBeInTheDocument();
    expect(screen.getByText(`Frequency: ${frequency}`)).toBeInTheDocument();
  });

  test('renders nothing when data.subscales is empty', () => {
    renderWithProviders(<AllScores data={{ subscales: [] }} latestFinalScore={null} frequency={0} versions={[]} />);

    expect(screen.queryByText('Subscale Scores')).not.toBeInTheDocument();
    expect(screen.queryByTestId('subscale-line-chart')).not.toBeInTheDocument();
  });
});
