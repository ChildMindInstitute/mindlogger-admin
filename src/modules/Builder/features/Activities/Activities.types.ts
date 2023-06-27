import { PerfTaskType } from 'shared/consts';

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
  performanceTaskType?: PerfTaskType;
} | null;

export enum EditablePerformanceTasksType {
  Flanker = 'flanker',
  Gyroscope = 'gyroscope',
  Touch = 'touch',
}

export const enum PerformanceTasks {
  AbTrailsIpad = 'A/B Trails iPad',
  AbTrailsMobile = 'A/B Trails Mobile',
  Flanker = 'Simple & Choice Reaction Time Task Builder',
  Gyroscope = 'CST Gyroscope',
  Touch = 'CST Touch',
}

export type ActivityName = { name: string; sequenceNumbers: number[] };
export type ActivityNames = ActivityName[];
