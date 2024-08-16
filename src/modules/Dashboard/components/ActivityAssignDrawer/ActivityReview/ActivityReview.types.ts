import { Activity } from 'redux/modules';
import { HydratedActivityFlow } from 'modules/Dashboard/types';
import { useParticipantDropdown } from 'modules/Dashboard/components';

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
  'data-testid': string;
} & (ActivityReviewWithActivity | ActivityReviewWithFlow) &
  Omit<ReturnType<typeof useParticipantDropdown>, 'isLoading'>;
