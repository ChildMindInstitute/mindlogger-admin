import { MenuActionProps } from 'shared/components';
import { Activity } from 'redux/modules';
import { Roles } from 'shared/consts';

export type ActivityActionProps = {
  activityId: string;
  appletId: string;
};

export type ActivitiesData = {
  result: Activity[];
  count: number;
};

export type ActivityActions = {
  actions: {
    editActivity: (props: MenuActionProps<ActivityActionProps>) => void;
    exportData: (props: MenuActionProps<ActivityActionProps>) => void;
    assignActivity: (props: MenuActionProps<ActivityActionProps>) => void;
    takeNow: (props: MenuActionProps<ActivityActionProps>) => void;
  };
  dataTestid: string;
  appletId: string;
  activityId: string;
  roles?: Roles[];
};