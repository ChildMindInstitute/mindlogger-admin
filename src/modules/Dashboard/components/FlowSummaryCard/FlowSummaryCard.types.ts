import { BoxProps } from '@mui/material';

import { MenuItem } from 'shared/components';

import { HydratedActivityFlow } from '../FlowGrid/FlowGrid.types';

export interface FlowSummaryCardProps<T> extends BoxProps {
  appletId?: string;
  flow: HydratedActivityFlow;
  menuItems?: MenuItem<T>[];
}
