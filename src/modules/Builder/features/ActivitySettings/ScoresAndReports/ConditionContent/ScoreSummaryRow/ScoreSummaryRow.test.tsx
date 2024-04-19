import { screen } from '@testing-library/react';

import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';

import { ScoreSummaryRow } from './ScoreSummaryRow';

describe('ScoreSummaryRow', () => {
  test('should render with default value', () => {
    renderWithAppletFormData({
      children: (
        <ScoreSummaryRow
          name="activities.0.scoresAndReports.reports.0.conditionalLogic.0"
          data-testid="score-summary-row"
        />
      ),
    });

    const match = screen.getByTestId('score-summary-row-match');

    expect(match).toBeInTheDocument();
    expect(screen.getByText('conditions are true:')).toBeInTheDocument();

    const matchInput = match.querySelector('input');

    matchInput && expect(matchInput.value).toBe('all');
  });
});
