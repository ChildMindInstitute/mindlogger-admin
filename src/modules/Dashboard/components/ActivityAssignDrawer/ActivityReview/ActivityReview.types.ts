import { Activity } from 'redux/modules';
import { HydratedActivityFlow } from 'modules/Dashboard/types';
import { ParticipantDropdownOption, useParticipantDropdown } from 'modules/Dashboard/components';

import { ValidActivityAssignment } from '../ActivityAssignDrawer.types';

type ActivityReviewWithActivity = {
  activity: Activity;
  flow?: never;
};

type ActivityReviewWithFlow = {
  activity?: never;
  flow: HydratedActivityFlow;
};

export type ActivityReviewProps = {
  isSingleActivity?: boolean;
  index: number;
  assignments: ValidActivityAssignment[];
  onDelete: (activityOrFlow: Activity | HydratedActivityFlow) => void;
  // Forwarded to the read-only table so search-selected participants resolve
  knownParticipants?: ParticipantDropdownOption[];
  'data-testid': string;
} & (ActivityReviewWithActivity | ActivityReviewWithFlow) &
  Omit<ReturnType<typeof useParticipantDropdown>, 'isLoading'>;
