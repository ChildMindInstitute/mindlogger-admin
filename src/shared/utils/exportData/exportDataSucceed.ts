import { AxiosResponse } from 'axios';

import {
  prepareData,
  exportTemplate,
  getReportZipName,
  ZipFile,
  exportCsvZip,
  exportMediaZip,
} from 'shared/utils';
import { GENERAL_REPORT_NAME, JOURNEY_REPORT_NAME } from 'shared/consts';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

export const exportDataSucceed =
  ({
    callback,
    getDecryptedAnswers,
  }: {
    callback?: () => void;
    getDecryptedAnswers: ReturnType<typeof useDecryptedActivityData>;
  }) =>
  (response: AxiosResponse | null) => {
    if (!response?.data?.result) return;

    const {
      reportData,
      activityJourneyData,
      mediaData,
      drawingItemsData,
      stabilityTrackerItemsData,
    } = prepareData(response.data.result, getDecryptedAnswers);

    exportTemplate(reportData, GENERAL_REPORT_NAME);
    exportTemplate(activityJourneyData, JOURNEY_REPORT_NAME);
    (async () => {
      await exportCsvZip(drawingItemsData, getReportZipName(ZipFile.Drawing));
    })();
    (async () => {
      await exportCsvZip(stabilityTrackerItemsData, getReportZipName(ZipFile.StabilityTracker));
    })();
    (async () => {
      await exportMediaZip(mediaData, getReportZipName(ZipFile.Media));
      callback?.();
    })();
  };
