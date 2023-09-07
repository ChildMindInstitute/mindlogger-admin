import { AxiosResponse } from 'axios';

import {
  exportCsvZip,
  exportMediaZip,
  exportTemplate,
  getReportZipName,
  prepareData,
  ZipFile,
} from 'shared/utils';
import {
  activityJourneyHeader,
  GENERAL_REPORT_NAME,
  JOURNEY_REPORT_NAME,
  reportHeader,
} from 'shared/consts';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

export const exportDataSucceed =
  ({
    callback,
    getDecryptedAnswers,
  }: {
    callback?: () => void;
    getDecryptedAnswers: ReturnType<typeof useDecryptedActivityData>;
  }) =>
  async (response: AxiosResponse | null) => {
    if (!response?.data?.result) return;

    const {
      reportData,
      activityJourneyData,
      mediaData,
      drawingItemsData,
      stabilityTrackerItemsData,
      abTrailsItemsData,
      flankerItemsData,
    } = await prepareData(response.data.result, getDecryptedAnswers);

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
