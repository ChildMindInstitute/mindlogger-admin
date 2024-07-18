import { DrawerProps } from '@mui/material';

export type ActivityAssignDrawerProps = Pick<DrawerProps, 'open'> & {
  onClose: () => void;
  appletId?: string;
  activityId?: string;
  activityFlowId?: string;
  /** User ID */
  respondentId?: string;
  targetSubjectId?: string;
};

export type ActivityAssignment = {
  /** User ID */
  respondentId?: string;
  targetSubjectId?: string;
};

export type ActivityAssignFormValues = {
  activityIds: string[];
  flowIds: string[];
  assignments: ActivityAssignment[];
};
