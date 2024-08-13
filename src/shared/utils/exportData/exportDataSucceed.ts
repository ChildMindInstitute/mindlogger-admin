import {
  activityJourneyHeader,
  GENERAL_REPORT_NAME,
  JOURNEY_REPORT_NAME,
  reportHeader,
} from 'shared/consts';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import {
  AppletExportData,
  ExportDataResult,
  ExtendedExportAnswerWithoutEncryption,
  DecryptedActivityData,
} from 'shared/types';

import { exportTemplate } from '../exportTemplate';
import { exportCsvZip } from './exportCsvZip';
import { exportMediaZip } from './exportMediaZip';
import { getReportZipName, ZipFile } from './getReportName';
import { ExportDataFilters, prepareEncryptedData, prepareDecryptedData } from './prepareData';

const exportProcessedData = async ({
  reportData,
  activityJourneyData,
  mediaData,
  drawingItemsData,
  stabilityTrackerItemsData,
  abTrailsItemsData,
  flankerItemsData,
  suffix,
}: AppletExportData & { suffix: string }) => {
  await exportTemplate({
    data: reportData,
    fileName: GENERAL_REPORT_NAME + suffix,
    defaultData: reportData.length > 0 ? null : reportHeader,
  });
  await exportTemplate({
    data: activityJourneyData,
    fileName: JOURNEY_REPORT_NAME + suffix,
    defaultData: activityJourneyData.length > 0 ? null : activityJourneyHeader,
  });

  await Promise.allSettled([
    exportCsvZip(drawingItemsData, getReportZipName(ZipFile.Drawing, suffix)),
    exportCsvZip(stabilityTrackerItemsData, getReportZipName(ZipFile.StabilityTracker, suffix)),
    exportCsvZip(abTrailsItemsData, getReportZipName(ZipFile.ABTrails, suffix)),
    exportCsvZip(flankerItemsData, getReportZipName(ZipFile.Flanker, suffix)),
    exportMediaZip(mediaData, getReportZipName(ZipFile.Media, suffix)),
  ]);
};

export const exportEncryptedDataSucceed =
  ({
    getDecryptedAnswers,
    suffix,
    filters,
  }: {
    getDecryptedAnswers: ReturnType<typeof useDecryptedActivityData>;
    suffix: string;
    filters?: ExportDataFilters;
  }) =>
  async (result: ExportDataResult) => {
    if (!result) return;

    const exportData = await prepareEncryptedData(result, getDecryptedAnswers, filters);
    await exportProcessedData({ ...exportData, suffix });
  };

export const exportDecryptedDataSucceed =
  ({ suffix, filters }: { suffix: string; filters?: ExportDataFilters }) =>
  async (parsedAnswers: DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>[]) => {
    if (!parsedAnswers) return;

    const exportData = await prepareDecryptedData(parsedAnswers, filters);
    await exportProcessedData({ ...exportData, suffix });
  };
