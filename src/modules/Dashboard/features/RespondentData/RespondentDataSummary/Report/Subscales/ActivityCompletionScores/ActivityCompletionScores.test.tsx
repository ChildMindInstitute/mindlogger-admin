// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils';

import { ReportContext } from '../../Report.context';
import { ActivityCompletionScores } from './ActivityCompletionScores';

jest.mock('modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Charts', () => ({
  BarChart: () => <div data-testid="mocked-bar-chart" />,
}));

jest.mock('../AdditionalInformation', () => ({
  AdditionalInformation: ({ optionText }: { optionText: string }) => (
    <div data-testid="mocked-additional-information">{optionText}</div>
  ),
}));

describe('ActivityCompletionScores component', () => {
  test('renders component with correct data', async () => {
    const mockedSubscaleScores = [
      { subscale: 'Subscale 1', score: 20 },
      { subscale: 'Subscale 2', score: 30 },
    ];

    const setCurrentActivityCompletionData = jest.fn();

    renderWithProviders(
      <ReportContext.Provider
        value={{
          setCurrentActivityCompletionData,
        }}
      >
        <ActivityCompletionScores
          reviewDate={new Date('2024-01-23T20:10:15')}
          finalSubscaleScore={25}
          frequency={3}
          optionText="Mocked option text"
          subscaleScores={mockedSubscaleScores}
          showAllSubscaleResultsVisible={true}
        />
      </ReportContext.Provider>,
    );

    expect(screen.getByText('Subscale Scores')).toBeInTheDocument();
    const showAllSubscaleResultsButton = screen.getByTestId('show-all-subscale-results');
    expect(showAllSubscaleResultsButton).toBeInTheDocument();
    expect(screen.getByText('Review Date: 23 Jan 2024')).toBeInTheDocument();
    expect(screen.getByText('Time: 20:10:15')).toBeInTheDocument();
    expect(screen.getByText('Final Subscale Score: 25')).toBeInTheDocument();
    expect(screen.getByText('Frequency: 3')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-additional-information')).toHaveTextContent(
      'Mocked option text',
    );

    await userEvent.click(showAllSubscaleResultsButton);
    expect(setCurrentActivityCompletionData).toHaveBeenCalledTimes(1);
  });
});
