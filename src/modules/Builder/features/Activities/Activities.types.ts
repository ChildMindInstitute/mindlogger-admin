import {
  ActivityFormValues,
  ItemFormValues,
  FlankerFormValues,
  GyroscopeFormValues,
} from 'modules/Builder/types';

export type GetActivitiesActions = {
  key: string;
  isActivityHidden?: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onVisibilityChange: () => void;
  onRemove: () => void;
  isEditVisible: boolean;
};

export type ActivityAddProps = {
  index?: number;
  performanceTaskName?: string;
  performanceTaskDesc?: string;
  isNavigationBlocked?: boolean;
  type?: PerformanceTasks;
} | null;

export type ActivityProps =
  | ActivityFormValues
  | ((GyroscopeFormValues | FlankerFormValues) & {
      image?: string;
      items?: ItemFormValues[];
      type?: PerformanceTasks;
    });

export const enum PerformanceTasks {
  AbTrailsIpad = 'A/B Trails iPad',
  AbTrailsMobile = 'A/B Trails Mobile',
  Flanker = 'Simple & Choice Reaction Time Task Builder',
  Gyroscope = 'CST Gyroscope',
  Touch = 'CST Touch',
}
