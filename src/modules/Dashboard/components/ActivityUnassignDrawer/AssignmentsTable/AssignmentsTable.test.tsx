import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { t } from 'i18next';

import { mockedActivityId, mockedOwnerSubject, mockedFullParticipant } from 'shared/mock';
import { HydratedAssignment } from 'api';

import { AssignmentsTable } from './AssignmentsTable';
import { AssignmentsTableProps } from './AssignmentsTable.types';

/* Mock data
=================================================== */

const mockOnChange = jest.fn();
const mockTestId = 'test-id';
const mockedAssignment: HydratedAssignment = {
  id: '1',
  activityId: mockedActivityId,
  activityFlowId: null,
  respondentSubject: mockedOwnerSubject,
  targetSubject: {
    id: mockedFullParticipant.details[0].subjectId,
    userId: mockedFullParticipant.id,
    lastSeen: mockedFullParticipant.lastSeen,
    firstName: mockedFullParticipant.details[0].subjectFirstName,
    lastName: mockedFullParticipant.details[0].subjectLastName,
    secretUserId: mockedFullParticipant.details[0].respondentSecretId,
    nickname: mockedFullParticipant.details[0].respondentNickname,
    tag: mockedFullParticipant.details[0].subjectTag,
  },
};

const mockProps: AssignmentsTableProps = {
  assignments: [mockedAssignment],
  selected: [],
  onChange: mockOnChange,
  'data-testid': mockTestId,
};

/* Tests
=================================================== */

describe('AssignmentsTable', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the assignments table', () => {
    render(<AssignmentsTable {...mockProps} />);

    const assignmentsTable = screen.getByTestId(mockTestId);
    expect(assignmentsTable).toBeInTheDocument();
  });

  it('should call change handler when checkbox toggled', () => {
    render(<AssignmentsTable {...mockProps} />);

    const checkbox = within(screen.getByTestId(`${mockTestId}-0-cell-id`)).getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalledWith([mockedAssignment]);
  });

  it('should render participant snippets', async () => {
    render(<AssignmentsTable {...mockProps} />);

    const respondentCell = screen.getByTestId(`${mockTestId}-0-cell-respondentSubject`);
    const subjectCell = screen.getByTestId(`${mockTestId}-0-cell-targetSubject`);

    await waitFor(() => {
      expect(
        within(respondentCell).getByText(mockedAssignment.respondentSubject.nickname),
      ).toBeInTheDocument();
      expect(
        within(respondentCell).getByText(
          t(`participantTag.${mockedAssignment.respondentSubject.tag}`),
        ),
      ).toBeInTheDocument();

      expect(
        within(subjectCell).getByText(mockedAssignment.targetSubject.nickname),
      ).toBeInTheDocument();
      expect(
        within(subjectCell).getByText(t(`participantTag.${mockedAssignment.targetSubject.tag}`)),
      ).toBeInTheDocument();
    });
  });
});
