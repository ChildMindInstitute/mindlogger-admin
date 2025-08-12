import {
  JOURNEY_REPORT_NAME,
  LEGACY_GENERAL_REPORT_NAME,
  legacyActivityJourneyHeader,
  legacyReportHeader,
  GENERAL_REPORT_NAME,
  activityJourneyHeader,
  reportHeader,
} from 'shared/consts';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import {
  AppletExportData,
  ExportDataResult,
  ExtendedExportAnswerWithoutEncryption,
  DecryptedActivityData,
} from 'shared/types';
import { FeatureFlags } from 'shared/types/featureFlags';

import { exportTemplate } from '../exportTemplate';
import { exportCsvZip } from './exportCsvZip';
import { exportMediaZip } from './exportMediaZip';
import { getReportZipName, ZipFile } from './getReportName';
import { ExportDataFilters, prepareEncryptedData, prepareDecryptedData } from './prepareData';
import { sanitizeCSVData } from '../csvSanitization';

const exportProcessedData = async ({
  reportData,
  activityJourneyData,
  mediaData,
  drawingItemsData,
  stabilityTrackerItemsData,
  abTrailsItemsData,
  flankerItemsData,
  suffix,
  flags,
}: AppletExportData & { suffix: string; flags: FeatureFlags }) => {
  const reportHeaders = flags.enableDataExportRenaming
    ? { general: reportHeader, activity: activityJourneyHeader }
    : { general: legacyReportHeader, activity: legacyActivityJourneyHeader };

  // Sanitize user-controlled data before CSV export to prevent CSV injection attacks
  const sanitizedReportData = sanitizeCSVData(
    reportData.filter(Boolean) as Record<string, unknown>[],
  );
  const sanitizedActivityJourneyData = sanitizeCSVData(
    activityJourneyData.filter(Boolean) as Record<string, unknown>[],
  );

  await exportTemplate({
    data: sanitizedReportData,
    fileName:
      (flags.enableDataExportRenaming ? GENERAL_REPORT_NAME : LEGACY_GENERAL_REPORT_NAME) + suffix,
    defaultData: sanitizedReportData.length > 0 ? null : reportHeaders.general,
  });
  await exportTemplate({
    data: sanitizedActivityJourneyData,
    fileName: JOURNEY_REPORT_NAME + suffix,
    defaultData: sanitizedActivityJourneyData.length > 0 ? null : reportHeaders.activity,
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
    flags,
  }: {
    getDecryptedAnswers: ReturnType<typeof useDecryptedActivityData>;
    suffix: string;
    filters?: ExportDataFilters;
    flags: FeatureFlags;
  }) =>
  async (result: ExportDataResult) => {
    if (!result) return;

    const exportData = await prepareEncryptedData(result, getDecryptedAnswers, flags, filters);
    await exportProcessedData({ ...exportData, suffix, flags });
  };

export const exportDecryptedDataSucceed =
  ({
    suffix,
    filters,
    flags,
  }: {
    suffix: string;
    filters?: ExportDataFilters;
    flags: FeatureFlags;
  }) =>
  async (parsedAnswers: DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>[]) => {
    if (!parsedAnswers) return;

    const exportData = await prepareDecryptedData(parsedAnswers, flags, filters);
    await exportProcessedData({ ...exportData, suffix, flags });
  };
