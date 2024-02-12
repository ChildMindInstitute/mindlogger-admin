// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { render, screen } from '@testing-library/react';

import { getEmptyState, getUniqueIdentifierOptions } from './RespondentDataSummary.utils';

describe('getUniqueIdentifierOptions', () => {
  test('should return an empty array for an empty identifiers array', () => {
    const result = getUniqueIdentifierOptions([]);
    expect(result).toEqual([]);
  });

  test('should return unique identifier options', () => {
    const identifiers = [
      { decryptedValue: 'decryptedValue_id1', encryptedValue: 'encryptedValue_id1' },
      { decryptedValue: 'decryptedValue_id2', encryptedValue: 'encryptedValue_id2' },
      { decryptedValue: 'decryptedValue_id2', encryptedValue: 'encryptedValue_id2' }, // duplicate
    ];

    const result = getUniqueIdentifierOptions(identifiers);
    expect(result).toEqual([
      { label: 'decryptedValue_id1', id: 'decryptedValue_id1' },
      { label: 'decryptedValue_id2', id: 'decryptedValue_id2' },
    ]);
  });
});

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
