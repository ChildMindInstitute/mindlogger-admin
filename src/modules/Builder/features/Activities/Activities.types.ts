import { PerfTaskType } from 'shared/consts';

export type GetActivitiesActions = {
  key: string;
  isActivityHidden?: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onVisibilityChange: () => void;
  onRemove: () => void;
  isEditVisible: boolean;
  'data-testid'?: string;
};

export type ActivityAddProps = {
  index?: number;
  performanceTaskName?: string;
  performanceTaskDesc?: string;
  isNavigationBlocked?: boolean;
  performanceTaskType?: PerfTaskType;
} | null;

export enum EditablePerformanceTasksType {
  Flanker = 'flanker',
  Gyroscope = 'gyroscope',
  Touch = 'touch',
}

export const enum PerformanceTasks {
  AbTrailsIpad = 'abTrailsIpad',
  AbTrailsMobile = 'abTrailsMobile',
  Flanker = 'flanker',
  Gyroscope = 'gyroscope',
  Touch = 'touch',
  Unity = 'unity',
}
