import { EditablePerformanceTasksType } from './Activities.types';

export const EditablePerformanceTasks: string[] = [
  EditablePerformanceTasksType.Flanker,
  EditablePerformanceTasksType.Gyroscope,
  EditablePerformanceTasksType.Touch,
];

export const withoutNumberRegex = /^(.*?)\s*\(\d+\)$/;
export const numberRegex = /\((\d+)\)$/;
