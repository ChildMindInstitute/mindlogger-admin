import { BoxProps } from '@mui/material';

import { SubjectDetailsWithRoles } from 'modules/Dashboard/types';
import { Activity, ActivityFlow, SingleApplet } from 'redux/modules';

export interface FlowGridProps extends BoxProps {
  applet?: SingleApplet;
  flows?: ActivityFlow[];
  activities?: Activity[];
  subject?: SubjectDetailsWithRoles;
  onClickAssign: (flowId: string) => void;
  onClickUnassign?: (flowId: string) => void;
  onClickItem?: (props: { activityFlowId: string }) => void;
  'data-testid': string;
}

export type UseFlowGridMenuProps = {
  appletId?: string;
  hasParticipants?: boolean;
  testId: string;
  subject?: SubjectDetailsWithRoles;
  onClickExportData: (flowId: string) => void;
  onClickAssign: (flowId: string) => void;
  onClickUnassign?: (flowId: string) => void;
};
