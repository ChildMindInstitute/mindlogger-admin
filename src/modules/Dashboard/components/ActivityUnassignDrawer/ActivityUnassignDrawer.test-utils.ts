import { screen, within } from '@testing-library/react';

import { SubjectDetails } from 'modules/Dashboard/types';

const DEFAULT_TEST_ID = 'applet-activity-unassign-assignments-table';

/**
 * Check the values of an assignment
 */
export const checkAssignment = (
  respondentSubject: SubjectDetails,
  targetSubject: SubjectDetails,
  index = 0,
  testId = DEFAULT_TEST_ID,
) => {
  const withinRespondentCell = within(
    screen.getByTestId(`${testId}-${index}-cell-respondentSubject`),
  );
  const withinTargetCell = within(screen.getByTestId(`${testId}-${index}-cell-targetSubject`));

  expect(withinRespondentCell.getByText(respondentSubject.nickname)).toBeInTheDocument();
  if (respondentSubject.tag) {
    expect(withinRespondentCell.getByText(respondentSubject.tag)).toBeInTheDocument();
  }

  expect(withinTargetCell.getByText(targetSubject.nickname)).toBeInTheDocument();
  if (targetSubject.tag) {
    expect(withinTargetCell.getByText(targetSubject.tag)).toBeInTheDocument();
  }
};
