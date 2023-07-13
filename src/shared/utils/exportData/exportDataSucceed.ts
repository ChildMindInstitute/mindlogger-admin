import { AxiosResponse } from 'axios';

import { prepareData } from 'shared/utils/exportData/prepareData';
import { exportTemplate } from 'shared/utils/exportTemplate';
import { GENERAL_REPORT_NAME, JOURNEY_REPORT_NAME } from 'shared/consts';
import { exportLinesZip } from 'shared/utils/exportData/exportLinesZip';
import { getReportZipName, ZipFile } from 'shared/utils/exportData/getReportName';
import { exportMediaZip } from 'shared/utils/exportData/exportMediaZip';
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
      await exportLinesZip(drawingItemsData, getReportZipName(ZipFile.Drawing));
    })();
    (async () => {
      await exportLinesZip(stabilityTrackerItemsData, getReportZipName(ZipFile.StabilityTracker));
    })();
    (async () => {
      await exportMediaZip(mediaData, getReportZipName(ZipFile.Media));
      callback?.();
    })();
  };
