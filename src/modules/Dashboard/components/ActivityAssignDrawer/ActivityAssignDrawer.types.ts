import { DrawerProps } from '@mui/material';

export type ActivityAssignDrawerProps = Pick<DrawerProps, 'open'> & {
  onClose: () => void;
  appletId?: string;
  activityId?: string;
  activityFlowId?: string;
  sourceSubjectId?: string;
  targetSubjectId?: string;
};
