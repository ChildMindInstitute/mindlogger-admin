import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ReportEmptyState } from './ReportEmptyState';

describe('Report Content utils', () => {
  describe('getEmptyState', () => {
    test('returns JSX for no selected activity', () => {
      renderWithProviders(<ReportEmptyState selectedEntity={null} />);

      expect(
        screen.getByText(/Select the Activity or Activity Flow to review the response data./),
      ).toBeInTheDocument();
    });

    test('returns JSX for performance task', () => {
      const selectedEntity = {
        id: '1',
        name: 'Activity',
        lastAnswerDate: null,
        isPerformanceTask: true,
        hasAnswer: true,
        isFlow: false,
      };

      renderWithProviders(<ReportEmptyState selectedEntity={selectedEntity} />);

      expect(
        screen.getByText(/Data visualization for Performance Tasks not supported/),
      ).toBeInTheDocument();
    });
  });
});
