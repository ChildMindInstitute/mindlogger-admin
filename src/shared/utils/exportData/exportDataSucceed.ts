import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import {
  activityJourneyHeader,
  GENERAL_REPORT_NAME,
  JOURNEY_REPORT_NAME,
  LEGACY_GENERAL_REPORT_NAME,
  legacyActivityJourneyHeader,
  legacyReportHeader,
  reportHeader,
} from 'shared/consts';
import {
  AppletExportData,
  DecryptedActivityData,
  ExportDataResult,
  ExtendedExportAnswerWithoutEncryption,
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
  shouldGenerateUserJourney,
}: AppletExportData & {
  suffix: string;
  flags: FeatureFlags;
  shouldGenerateUserJourney: boolean;
}) => {
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

  if (shouldGenerateUserJourney)
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
    shouldGenerateUserJourney,
  }: {
    getDecryptedAnswers: ReturnType<typeof useDecryptedActivityData>;
    suffix: string;
    filters?: ExportDataFilters;
    flags: FeatureFlags;
    shouldGenerateUserJourney: boolean;
  }) =>
  async (result: ExportDataResult) => {
    if (!result) return;

    const exportData = await prepareEncryptedData({
      data: result,
      getDecryptedAnswers,
      flags,
      shouldGenerateUserJourney,
      filters,
    });
    await exportProcessedData({ ...exportData, suffix, flags, shouldGenerateUserJourney });
  };

export const exportDecryptedDataSucceed =
  ({
    suffix,
    filters,
    flags,
    shouldGenerateUserJourney,
  }: {
    suffix: string;
    filters?: ExportDataFilters;
    flags: FeatureFlags;
    shouldGenerateUserJourney: boolean;
  }) =>
  async (parsedAnswers: DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>[]) => {
    if (!parsedAnswers) return;

    const exportData = await prepareDecryptedData({
      parsedAnswers,
      flags,
      shouldGenerateUserJourney,
      filters,
    });
    await exportProcessedData({ ...exportData, suffix, flags, shouldGenerateUserJourney });
  };
