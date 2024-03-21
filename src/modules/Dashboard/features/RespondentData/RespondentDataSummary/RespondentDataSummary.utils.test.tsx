// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { render, screen } from '@testing-library/react';

import { getEmptyState } from './RespondentDataSummary.utils';

describe('getEmptyState', () => {
  test('returns JSX for no selected activity', () => {
    const result = getEmptyState();

    render(<>{result}</>);

    expect(
      screen.getByText(/Select the Activity to review the response data./),
    ).toBeInTheDocument();
  });

  test('returns JSX for performance task', () => {
    const selectedActivity = {
      isPerformanceTask: true,
    };

    const result = getEmptyState(selectedActivity);

    render(<>{result}</>);

    expect(
      screen.getByText(/Data visualization for Performance Tasks not supported/),
    ).toBeInTheDocument();
  });

  test('returns JSX for activity with no data', () => {
    const selectedActivity = {
      hasAnswer: false,
    };

    const result = getEmptyState(selectedActivity);

    render(<>{result}</>);

    expect(screen.getByText(/No available Data for this Activity yet/)).toBeInTheDocument();
  });
});
