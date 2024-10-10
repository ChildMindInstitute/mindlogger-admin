import { DrawerProps } from '@mui/material';

import { AssignedActivity, HydratedAssignment, ParticipantActivityOrFlow } from 'api';
import { AssignedHydratedActivityFlow } from 'modules/Dashboard/types';

type ActivityOrFlow = AssignedActivity | AssignedHydratedActivityFlow | ParticipantActivityOrFlow;

export type ActivityUnassignDrawerProps = Pick<DrawerProps, 'open'> & {
  onClose: (shouldRefetch?: boolean) => void;
  appletId?: string;
  activityOrFlow?: ActivityOrFlow;
};

export type ActivityUnassignFormValues = {
  selected: HydratedAssignment[];
};
