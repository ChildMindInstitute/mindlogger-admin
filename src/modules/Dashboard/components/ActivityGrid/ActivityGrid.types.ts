import { FC } from 'react';

import { MenuActionProps, Row } from 'shared/components';
import { Roles } from 'shared/consts';
import { AssignedActivity } from 'api';
import { Order } from 'shared/types';
import { FeatureFlags } from 'shared/types/featureFlags';

import { TakeNowModalProps } from '../TakeNowModal/TakeNowModal.types';

export type ActivityGridProps = {
  rows?: Row[];
  TakeNowModal: FC<TakeNowModalProps>;
  order: Order;
  orderBy: string;
  'data-testid': string;
  onClickItem?: (props: { activityId: string }) => void;
};

export type UseActivityGridProps = {
  dataTestId: string;
  activitiesData: {
    activities: AssignedActivity[];
    total: number;
  };
  onClickExportData: (activityId: string) => void;
  onClickAssign: (activityId: string) => void;
  onClickUnassign?: (activityId: string) => void;
};

export type ActivityActionProps = {
  activityId: string;
  appletId: string;
  participantId?: string;
};

export type ActivityActions = {
  actions: ActionsObject;
  dataTestId: string;
  appletId: string;
  subjectId?: string;
  roles?: Roles[];
  hasParticipants?: boolean;
  featureFlags: FeatureFlags;
  activity: AssignedActivity;
};

export type ActionsObject = {
  editActivity?: (props: MenuActionProps<ActivityActionProps>) => void;
  exportData?: (props: MenuActionProps<ActivityActionProps>) => void;
  assignActivity?: (props: MenuActionProps<ActivityActionProps>) => void;
  unassignActivity?: (props: MenuActionProps<ActivityActionProps>) => void;
  takeNow?: (props: MenuActionProps<ActivityActionProps>) => void;
};
