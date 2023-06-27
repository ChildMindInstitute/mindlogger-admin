import { EditablePerformanceTasksType } from './Activities.types';

export const EditablePerformanceTasks: string[] = [
  EditablePerformanceTasksType.Flanker,
  EditablePerformanceTasksType.Gyroscope,
  EditablePerformanceTasksType.Touch,
];

// examples: "Activity name (1)", "Ab Trails Mobile (22)"
export const withoutNumberRegex = /^(.*?)\s*\(\d+\)$/;
export const numberRegex = /\((\d+)\)$/;
