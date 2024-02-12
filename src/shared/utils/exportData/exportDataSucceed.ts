import { activityJourneyHeader, GENERAL_REPORT_NAME, JOURNEY_REPORT_NAME, reportHeader } from 'shared/consts';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { ExportDataResult } from 'shared/types';

import { exportTemplate } from '../exportTemplate';
import { exportCsvZip } from './exportCsvZip';
import { exportMediaZip } from './exportMediaZip';
import { getReportZipName, ZipFile } from './getReportName';
import { prepareData } from './prepareData';

export const exportDataSucceed =
  ({
    getDecryptedAnswers,
    suffix,
  }: {
    getDecryptedAnswers: ReturnType<typeof useDecryptedActivityData>;
    suffix: string;
  }) =>
  async (result: ExportDataResult) => {
    if (!result) return;

    const {
      reportData,
      activityJourneyData,
      mediaData,
      drawingItemsData,
      stabilityTrackerItemsData,
      abTrailsItemsData,
      flankerItemsData,
    } = await prepareData(result, getDecryptedAnswers);

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
