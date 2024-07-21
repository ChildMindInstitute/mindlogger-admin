import {
  ParticipantDropdownOption,
  ParticipantDropdownProps,
  useParticipantDropdown,
} from 'modules/Dashboard/components';

import { ActivityAssignment } from '../ActivityAssignDrawer.types';

export type AssignmentsTableProps = Pick<
  ReturnType<typeof useParticipantDropdown>,
  | 'allParticipants'
  | 'participantsAndTeamMembers'
  | 'participantsAndTeamMembers'
  | 'fullAccountParticipantsAndTeamMembers'
  | 'handleSearch'
> & {
  teamMembersOnly: ParticipantDropdownOption[];
  assignments: ActivityAssignment[];
  onChange: (assignments: ActivityAssignment[]) => void;
  isReadOnly?: boolean;
  errors?: {
    duplicateRows?: `${string}_${string}`[];
  };
  'data-testid': string;
};

export type AssignmentDropdownProps = ParticipantDropdownProps & {
  isReadOnly?: boolean;
};
