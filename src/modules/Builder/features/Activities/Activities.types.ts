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
  isFlankerItem?: boolean;
} | null;

export const enum PerformanceTasks {
  AbTrailsIpad = 'A/B Trails iPad',
  AbTrailsMobile = 'A/B Trails Mobile',
  Flanker = 'Simple & Choice Reaction Time Task Builder',
  Gyroscope = 'CST Gyroscope',
  Touch = 'CST Touch',
}
