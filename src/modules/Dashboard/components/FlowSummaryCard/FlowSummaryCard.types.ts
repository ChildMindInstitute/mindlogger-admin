import { BoxProps } from '@mui/material';

import { MenuItem } from 'shared/components';
import { HydratedActivityFlow } from 'modules/Dashboard/types/Dashboard.types';

export type FlowSummaryCardProps<T> = Pick<BoxProps, 'component'> & {
  appletId?: string;
  flow: HydratedActivityFlow;
  menuItems?: MenuItem<T>[];
  onClick?: (props: { activityFlowId: string }) => void;
};
