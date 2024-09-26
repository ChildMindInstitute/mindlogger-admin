import { PropsWithChildren } from 'react';

import { ActivityAssignDrawerProps } from 'modules/Dashboard/components/ActivityAssignDrawer/ActivityAssignDrawer.types';
import { AssignedActivity } from 'api';
import { AssignedHydratedActivityFlow } from 'modules/Dashboard/types';

export type AssignmentsTabProps = PropsWithChildren<{
  onRefetch?: () => void;
  activityOrFlow?: AssignedActivity | AssignedHydratedActivityFlow;
}> &
  Pick<ActivityAssignDrawerProps, 'respondentSubjectId' | 'targetSubjectId'>;

export type AssignmentsTabHandle = {
  showAssign: () => void;
  showUnassign: () => void;
};
