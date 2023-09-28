import {
  DecryptedAnswerData,
  DecryptedStabilityTrackerAnswer,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';

export const enum ZipFile {
  Media = 'media',
  Drawing = 'drawing',
  StabilityTracker = 'stability-tracker',
  ABTrails = 'trails',
  Flanker = 'flanker',
}

export const getReportZipName = (name: ZipFile) =>
  `${name}-responses-${new Date().toDateString()}.zip`;

export const getStabilityTrackerCsvName = (
  id: string,
  phaseType: DecryptedStabilityTrackerAnswer['phaseType'],
) => `${id}_${phaseType}.csv`;

export const getABTrailsCsvName = (index: number, id?: string) =>
  `${id || ''}-trail${index + 1}.csv`;

export const getMediaFileName = (
  item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
  extension: string,
) => `${item.id}-${item.respondentId}-${item.activityItem.name}.${extension}`;

export const getFileExtension = (fileUrl: string) => {
  const extension = (fileUrl.split('/').pop()?.split('.').pop() ?? '').split('?')[0] ?? '';
  if (extension === 'quicktime') return 'MOV';

  return extension;
};

export const getFlankerCsvName = (
  item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
) => `${item.id}-${item.activityItem.name}.csv`;
