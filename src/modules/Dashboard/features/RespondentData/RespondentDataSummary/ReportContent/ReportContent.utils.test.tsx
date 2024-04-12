import { render, screen } from '@testing-library/react';

import { getEmptyState } from './ReportContent.utils';

describe('Report Content utils', () => {
  describe('getEmptyState', () => {
    test('returns JSX for no selected activity', () => {
      const result = getEmptyState(null);

      render(<>{result}</>);

      expect(
        screen.getByText(/Select the Activity to review the response data./),
      ).toBeInTheDocument();
    });

    test('returns JSX for performance task', () => {
      const selectedActivity = {
        id: '1',
        name: 'Activity',
        lastAnswerDate: null,
        isPerformanceTask: true,
      };

      const result = getEmptyState(selectedActivity);

      render(<>{result}</>);

      expect(
        screen.getByText(/Data visualization for Performance Tasks not supported/),
      ).toBeInTheDocument();
    });
  });
});
