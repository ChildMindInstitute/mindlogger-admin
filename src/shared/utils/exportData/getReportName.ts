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

export const getDrawingFileName = (
  item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
  extension: string,
) => `${item.id}-${item.activityItem.id}-${item.activityItem.name}.${extension}`;
