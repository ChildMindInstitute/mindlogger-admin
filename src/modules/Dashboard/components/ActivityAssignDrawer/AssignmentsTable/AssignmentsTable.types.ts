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
  // Superset of allParticipants used to resolve selected ids (e.g. ones found via search)
  knownParticipants?: ParticipantDropdownOption[];
  // Reports each picked option so the parent can remember participants not in the snapshot
  onParticipantSelect?: (option: ParticipantDropdownOption | null) => void;
  'data-testid': string;
};

export type AssignmentDropdownProps = ParticipantDropdownProps & {
  isReadOnly?: boolean;
};
