import { fireEvent, screen, waitFor } from '@testing-library/react';

const DEFAULT_TEST_ID = 'applet-activity-assign-assignments-table';

/**
 * Select a value in a participant drpodown
 */
export const selectParticipant = async (
  dropdown: 'respondent' | 'target-subject',
  subjectId: string,
  index = 0,
  testId = DEFAULT_TEST_ID,
) => {
  const dropdownTestId = `${testId}-${index}-${dropdown}-dropdown`;

  const participantInputElement = screen.getByTestId(dropdownTestId)?.querySelector('input');

  if (!participantInputElement) {
    throw new Error(`Autocomplete ${dropdown} dropdown element not found`);
  }

  fireEvent.mouseDown(participantInputElement);

  await waitFor(() => {
    const participantOption = screen.getByTestId(`${dropdownTestId}-option-${subjectId}`);
    fireEvent.click(participantOption);
  });
};

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
