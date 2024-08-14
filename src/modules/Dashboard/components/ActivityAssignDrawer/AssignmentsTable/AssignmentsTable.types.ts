import {
  ParticipantDropdownOption,
  ParticipantDropdownProps,
  useParticipantDropdown,
} from 'modules/Dashboard/components';

import { ActivityAssignment } from '../ActivityAssignDrawer.types';

export type AssignmentsTableProps = Omit<ReturnType<typeof useParticipantDropdown>, 'isLoading'> & {
  teamMembersOnly: ParticipantDropdownOption[];
  assignments: ActivityAssignment[];
  onChange?: (assignments: ActivityAssignment[]) => void;
  onAdd?: () => void;
  isReadOnly?: boolean;
  errors?: {
    duplicateRows?: `${string}_${string}`[];
  };
  'data-testid': string;
};

export type AssignmentDropdownProps = ParticipantDropdownProps & {
  isReadOnly?: boolean;
};
