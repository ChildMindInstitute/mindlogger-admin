import { AppletExportData, ExportDataResult } from 'shared/types/answer';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

import { getObjectFromList } from '../builderHelpers';
import { getAnswersWithPublicUrls, getParsedAnswers } from '../getParsedAnswers';
import {
  getABTrailsItemsData,
  getDrawingItemsData,
  getFlankerItemsData,
  getStabilityTrackerItemsData,
} from './getItemsData';
import { getActivityJourneyData, getMediaData, getReportData } from './getReportAndMediaData';

export const prepareData = async (
  data: ExportDataResult,
  getDecryptedAnswers: ReturnType<typeof useDecryptedActivityData>,
) => {
  const parsedAnswers = getParsedAnswers(data, getDecryptedAnswers);
  const parsedAnswersWithPublicUrls = await getAnswersWithPublicUrls(parsedAnswers);

  return parsedAnswersWithPublicUrls.reduce(
    (acc, data) => {
      const rawAnswersObject = getObjectFromList(
        data.decryptedAnswers,
        (item) => item.activityItem.name,
      );

      const reportData = getReportData(acc.reportData, rawAnswersObject, data.decryptedAnswers);
      const mediaData = getMediaData(acc.mediaData, data.decryptedAnswers);
      const activityJourneyData = getActivityJourneyData(
        acc.activityJourneyData,
        rawAnswersObject,
        data.decryptedAnswers,
        data.decryptedEvents,
      );
      const drawingItemsData = getDrawingItemsData(acc.drawingItemsData, data.decryptedAnswers);
      const stabilityTrackerItemsData = getStabilityTrackerItemsData(
        acc.stabilityTrackerItemsData,
        data.decryptedAnswers,
      );
      const abTrailsItemsData = getABTrailsItemsData(acc.abTrailsItemsData, data.decryptedAnswers);
      const flankerItemsData = getFlankerItemsData(acc.flankerItemsData, data.decryptedAnswers);

      return {
        reportData,
        activityJourneyData,
        mediaData,
        drawingItemsData,
        stabilityTrackerItemsData,
        abTrailsItemsData,
        flankerItemsData,
      };
    },
    {
      reportData: [],
      activityJourneyData: [],
      mediaData: [],
      drawingItemsData: [],
      stabilityTrackerItemsData: [],
      abTrailsItemsData: [],
      flankerItemsData: [],
    } as AppletExportData,
  );
};
