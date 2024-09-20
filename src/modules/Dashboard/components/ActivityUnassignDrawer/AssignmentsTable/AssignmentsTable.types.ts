import { HydratedAssignment } from 'api';
import { ParticipantDropdownProps } from 'modules/Dashboard/components';

export type AssignmentsTableProps = {
  assignments: HydratedAssignment[];
  selected: HydratedAssignment[];
  onChange?: (assignments: HydratedAssignment[]) => void;
  'data-testid': string;
};

export type AssignmentDropdownProps = ParticipantDropdownProps & {
  isReadOnly?: boolean;
};
