import { screen } from '@testing-library/react';

const DEFAULT_TEST_ID = 'applet-activity-unassign-assignments-table';

/**
 * Check the values of an assignment
 */
export const checkAssignment = (
  respondent: string,
  targetSubject: string,
  index = 0,
  testId = DEFAULT_TEST_ID,
) => {
  const respondentInput = screen
    .getByTestId(`${testId}-${index}-respondent-dropdown`)
    .querySelector('input');
  const targetSubjectInput = screen
    .getByTestId(`${testId}-${index}-target-subject-dropdown`)
    .querySelector('input');

  expect(respondentInput).toHaveValue(respondent);
  expect(targetSubjectInput).toHaveValue(targetSubject);
};
