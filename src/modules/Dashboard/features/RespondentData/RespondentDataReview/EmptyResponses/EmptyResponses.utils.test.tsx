import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { renderEmptyState } from './EmptyResponses.utils';

const emptyReview =
  'Select the date, Activity Flow or Activity, and response time to review the response data.';
const noAvailableData = 'No available Data yet';
const error = 'some error text';

describe('renderEmptyState', () => {
  test.each`
    isActivityOrFlowSelected | isAnswerSelected | error    | expected
    ${true}                  | ${true}          | ${null}  | ${noAvailableData}
    ${true}                  | ${false}         | ${null}  | ${emptyReview}
    ${false}                 | ${true}          | ${null}  | ${emptyReview}
    ${false}                 | ${false}         | ${null}  | ${emptyReview}
    ${true}                  | ${true}          | ${error} | ${error}
  `(
    'isActivityOrFlowSelected = $isActivityOrFlowSelected, isAnswerSelected = $isAnswerSelected, error = $error, expected = $expected',
    ({ expected, ...props }) => {
      renderWithProviders(renderEmptyState(props));
      expect(screen.getByText(expected)).toBeInTheDocument();
    },
  );
});
