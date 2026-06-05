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

/**
 * Shared options for {@link exportEncryptedDataSucceed} and {@link exportDecryptedDataSucceed}
 * (file naming, which answers to include, feature flags, journey CSV).
 */
export type ExportDataSucceedBaseOptions = {
  /** Appended to generated CSV and zip file names (e.g. subject or scope token). */
  suffix: string;
  /** Optional scope for which answers to include (activity, flow, or subject ids). */
  filters?: ExportDataFilters;
  /** Product feature flags that affect export output (e.g. report naming). */
  flags: FeatureFlags;
  /** When true, also emits the user-journey report CSV when applicable. */
  shouldGenerateUserJourney: boolean;
};

/** Options for {@link exportEncryptedDataSucceed} (same as base plus decryption). */
export type ExportEncryptedDataSucceedOptions = ExportDataSucceedBaseOptions & {
  /** Decrypts response payloads when preparing rows for export. */
  getDecryptedAnswers: ReturnType<typeof useDecryptedActivityData>;
};

const exportProcessedData = async ({
  reportData,
  activityJourneyData,
  mediaData,
  drawingItemsData,
  stabilityTrackerItemsData,
  abTrailsItemsData,
  flankerItemsData,
  unityData,
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
    exportMediaZip(unityData, getReportZipName(ZipFile.Unity, suffix)),
  ]);
};

/**
 * Returns an async function that exports applet response data from encrypted API results,
 * then writes CSV files and supplementary zips in the browser.
 *
 * @remarks Configuration fields are documented on {@link ExportEncryptedDataSucceedOptions}.
 */
export const exportEncryptedDataSucceed =
  ({
    getDecryptedAnswers,
    suffix,
    filters,
    flags,
    shouldGenerateUserJourney,
  }: ExportEncryptedDataSucceedOptions) =>
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

/**
 * Returns an async function that exports applet response data when answers are already decrypted,
 * then writes CSV files and supplementary zips in the browser.
 *
 * @remarks Configuration fields are documented on {@link ExportDataSucceedBaseOptions}.
 */
export const exportDecryptedDataSucceed =
  ({ suffix, filters, flags, shouldGenerateUserJourney }: ExportDataSucceedBaseOptions) =>
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
