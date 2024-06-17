import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const takeNowModalTestId = (testId: string) => `${testId}-take-now-modal`;

export const sourceSubjectDropdownTestId = (testId: string) =>
  `${takeNowModalTestId(testId)}-source-subject-dropdown`;

export const targetSubjectDropdownTestId = (testId: string) =>
  `${takeNowModalTestId(testId)}-target-subject-dropdown`;

export const selfReportCheckboxTestId = (testId: string) =>
  `${takeNowModalTestId(testId)}-participant-self-report-checkbox`;

export const openTakeNowModal = async (testId: string) => {
  await waitFor(() =>
    expect(screen.getAllByTestId(`${testId}-activity-actions-dots`)[0]).toBeVisible(),
  );

  await userEvent.click(screen.getAllByTestId(`${testId}-activity-actions-dots`)[0]);

  await waitFor(() => expect(screen.getByTestId(`${testId}-activity-take-now`)).toBeVisible());

  fireEvent.click(screen.getByTestId(`${testId}-activity-take-now`));

  await waitFor(() => expect(screen.getByTestId(`${takeNowModalTestId(testId)}`)).toBeVisible());
};

export const selectSourceSubject = async (testId: string, subjectId: string) => {
  const participantInputElement = screen
    .getByTestId(sourceSubjectDropdownTestId(testId))
    .querySelector('input');

  if (participantInputElement === null) {
    throw new Error('Autocomplete source subject dropdown element not found');
  }

  fireEvent.mouseDown(participantInputElement);

  const ownerParticipantOption = screen.getByTestId(
    `${sourceSubjectDropdownTestId(testId)}-option-${subjectId}`,
  );

  fireEvent.click(ownerParticipantOption);
};

export const toggleSelfReportCheckbox = async (testId: string) => {
  const checkbox = screen.getByTestId(selfReportCheckboxTestId(testId)).querySelector('input');

  if (checkbox === null) {
    throw new Error('Self-report checkbox not found');
  }

  fireEvent.click(checkbox);
};
