import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { mockedAppletData, mockedAppletId } from 'shared/mock';
import {
  MixpanelProps,
  Mixpanel,
  TakeNowDialogClosedEvent,
  MultiInformantStartActivityClickEvent,
  ProvidingResponsesDropdownOpenedEvent,
  ProvidingResponsesSelectionChangedEvent,
  OwnResponsesCheckboxToggledEvent,
  InputtingResponsesDropdownOpenedEvent,
  InputtingResponsesSelectionChangedEvent,
  ResponsesAboutDropdownOpenedEvent,
  ResponsesAboutSelectionChangedEvent,
  TakeNowClickEvent,
} from 'shared/utils';

const spyMixpanelTrack = vi.spyOn(Mixpanel, 'track');

export const takeNowModalTestId = (testId: string) => `${testId}-take-now-modal`;

export const sourceSubjectDropdownTestId = (testId: string) =>
  `${takeNowModalTestId(testId)}-source-subject-dropdown`;

export const loggedInUserDropdownTestId = (testId: string) =>
  `${takeNowModalTestId(testId)}-logged-in-user-dropdown`;

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

export const selectParticipant = async (
  testId: string,
  dropdown: 'source' | 'target' | 'loggedin',
  subjectId: string,
) => {
  const dropdownTestId = {
    source: sourceSubjectDropdownTestId,
    target: targetSubjectDropdownTestId,
    loggedin: loggedInUserDropdownTestId,
  }[dropdown](testId);

  const participantInputElement = screen.getByTestId(dropdownTestId).querySelector('input');

  if (participantInputElement === null) {
    throw new Error(`Autocomplete ${dropdown} dropdown element not found`);
  }

  fireEvent.mouseDown(participantInputElement);

  const participantOption = screen.getByTestId(`${dropdownTestId}-option-${subjectId}`);

  fireEvent.click(participantOption);
};

export const toggleSelfReportCheckbox = async (testId: string) => {
  const checkbox = screen.getByTestId(selfReportCheckboxTestId(testId)).querySelector('input');

  if (checkbox === null) {
    throw new Error('Self-report checkbox not found');
  }

  fireEvent.click(checkbox);
};

export const expectMixpanelTrack = (
  event:
    | TakeNowDialogClosedEvent
    | MultiInformantStartActivityClickEvent
    | ProvidingResponsesDropdownOpenedEvent
    | ProvidingResponsesSelectionChangedEvent
    | OwnResponsesCheckboxToggledEvent
    | InputtingResponsesDropdownOpenedEvent
    | InputtingResponsesSelectionChangedEvent
    | ResponsesAboutDropdownOpenedEvent
    | ResponsesAboutSelectionChangedEvent
    | TakeNowClickEvent,
) => {
  expect(spyMixpanelTrack).toHaveBeenCalledWith(
    expect.objectContaining({
      [MixpanelProps.Feature]: ['Multi-informant'],
      [MixpanelProps.AppletId]: mockedAppletId,
      [MixpanelProps.MultiInformantAssessmentId]: expect.any(String),
      [MixpanelProps.ActivityId]: mockedAppletData.activities[0].id,
      ...event,
    }),
  );
};
