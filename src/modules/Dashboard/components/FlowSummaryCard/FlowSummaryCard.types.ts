import { BoxProps } from '@mui/material';

import { Activity, ActivityFlow } from 'redux/modules';
import { MenuItem } from 'shared/components';

export interface FlowSummaryCardProps<T> extends BoxProps {
  appletId?: string;
  description?: ActivityFlow['description'];
  flowId?: string;
  activities?: Activity[];
  menuItems?: MenuItem<T>[];
  name?: React.ReactNode;
}
