import {
  activityJourneyHeader,
  GENERAL_REPORT_NAME,
  JOURNEY_REPORT_NAME,
  reportHeader,
} from 'shared/consts';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { ExportDataResult } from 'shared/types';

import { exportTemplate } from '../exportTemplate';
import { exportCsvZip } from './exportCsvZip';
import { exportMediaZip } from './exportMediaZip';
import { getReportZipName, ZipFile } from './getReportName';
import { prepareData } from './prepareData';

export const exportDataSucceed =
  ({
    callback,
    getDecryptedAnswers,
  }: {
    callback?: () => void;
    getDecryptedAnswers: ReturnType<typeof useDecryptedActivityData>;
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
      fileName: GENERAL_REPORT_NAME,
      defaultData: reportData.length > 0 ? null : reportHeader,
    });
    await exportTemplate({
      data: activityJourneyData,
      fileName: JOURNEY_REPORT_NAME,
      defaultData: activityJourneyData.length > 0 ? null : activityJourneyHeader,
    });

    await Promise.allSettled([
      exportCsvZip(drawingItemsData, getReportZipName(ZipFile.Drawing)),
      exportCsvZip(stabilityTrackerItemsData, getReportZipName(ZipFile.StabilityTracker)),
      exportCsvZip(abTrailsItemsData, getReportZipName(ZipFile.ABTrails)),
      exportCsvZip(flankerItemsData, getReportZipName(ZipFile.Flanker)),
      exportMediaZip(mediaData, getReportZipName(ZipFile.Media)),
    ]);
    callback?.();
  };
