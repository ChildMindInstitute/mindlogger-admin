import { DrawerProps } from '@mui/material';

import { AssignedActivity, HydratedAssignment } from 'api';
import { AssignedHydratedActivityFlow } from 'modules/Dashboard/types';

const ParticipantContext = ['respondent', 'target'] as const;
export type ParticipantContext = (typeof ParticipantContext)[number];

export type ActivityUnassignDrawerProps = Pick<DrawerProps, 'open'> & {
  onClose: (shouldRefetch?: boolean) => void;
  appletId?: string;
  activityOrFlow?: AssignedActivity | AssignedHydratedActivityFlow;
};

export type ActivityUnassignFormValues = {
  selected: HydratedAssignment[];
};
