import { MenuActionProps, Row } from 'shared/components';
import { Activity } from 'redux/modules';
import { Roles } from 'shared/consts';
import { DatavizActivity } from 'api';
import { Order } from 'shared/types';
import { FeatureFlags } from 'shared/types/featureFlags';

import { TakeNowModalProps } from '../TakeNowModal/TakeNowModal.types';

export type ActivityGridProps = {
  rows?: Row[];
  TakeNowModal: React.FC<TakeNowModalProps>;
  order: Order;
  orderBy: string;
  isLoading: boolean;
  'data-testid': string;
};

export type ActivityActionProps = {
  activityId: string;
  appletId: string;
  participantId?: string;
};

export type ActivitiesData = {
  result: Activity[] | DatavizActivity[];
  count: number;
};

export type BaseActivity = Partial<Activity>;

export type ActivityActions = {
  actions: ActionsObject;
  dataTestId: string;
  appletId: string;
  activityId: string;
  roles?: Roles[];
  featureFlags: FeatureFlags;
};

export type ActionsObject = {
  editActivity?: (props: MenuActionProps<ActivityActionProps>) => void;
  exportData?: (props: MenuActionProps<ActivityActionProps>) => void;
  assignActivity?: (props: MenuActionProps<ActivityActionProps>) => void;
  takeNow?: (props: MenuActionProps<ActivityActionProps>) => void;
};
