import { DecryptedAnswerData, DecryptedStabilityTrackerAnswerObject } from 'shared/types';

export const enum ZipFile {
  Media = 'media',
  Drawing = 'drawing',
  StabilityTracker = 'stability-tracker',
  ABTrails = 'trails',
  Flanker = 'flanker',
}

export const getReportZipName = (name: ZipFile, suffix: string) =>
  `${name}-responses-${new Date().toDateString()}${suffix}.zip`;

export const getStabilityTrackerCsvName = (
  id: string,
  phaseType: DecryptedStabilityTrackerAnswerObject['phaseType'],
) => `${id}_${phaseType}.csv`;

export const getABTrailsCsvName = (index: number, id?: string) =>
  `${id || ''}-trail${index + 1}.csv`;

export const getMediaFileName = (item: DecryptedAnswerData, extension: string) =>
  `${item.id}-${item.respondentId}-${item.activityItem.name}.${extension}`;

export const getFileExtension = (fileUrl: string) => {
  const extension = (fileUrl.split('/').pop()?.split('.').pop() ?? '').split('?')[0] ?? '';
  if (extension === 'quicktime') return 'MOV';

  return extension;
};

export const getFlankerCsvName = (item: DecryptedAnswerData) =>
  `${item.id}-${item.activityItem.name}.csv`;
