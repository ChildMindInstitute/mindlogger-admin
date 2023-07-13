import {
  DecryptedAnswerData,
  DecryptedStabilityTrackerAnswer,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';

export const enum ZipFile {
  Media = 'media',
  Drawing = 'drawing',
  StabilityTracker = 'stability-tracker',
}

export const getReportZipName = (name: ZipFile) =>
  `${name}-responses-${new Date().toDateString()}.zip`;

export const getStabilityTrackerCsvName = (
  id: string,
  phaseType: DecryptedStabilityTrackerAnswer['value']['phaseType'],
) => `${id}_${phaseType}.csv`;

export const getMediaFileName = (
  item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
  extension: string,
) => `${item.id}-${item.activityItem.id}-${item.activityItem.name}.${extension}`;

export const getFileExtension = (fileUrl: string) => {
  const extension = fileUrl.split('/').pop()?.split('.').pop() ?? '';
  if (extension === 'quicktime') return 'MOV';

  return extension;
};
