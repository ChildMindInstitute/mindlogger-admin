import { AppletExportData, ExportDataResult } from 'shared/types/answer';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

import { getObjectFromList } from '../getObjectFromList';
import {
  getAnswersWithPublicUrls,
  getParsedAnswers,
  remapFailedAnswers,
} from '../getParsedAnswers';
import {
  getABTrailsItemsData,
  getDrawingItemsData,
  getFlankerItemsData,
  getStabilityTrackerItemsData,
} from './getItemsData';
import { getActivityJourneyData, getMediaData, getReportData } from './getReportAndMediaData';

const getDefaultExportData = (): AppletExportData => ({
  reportData: [],
  activityJourneyData: [],
  mediaData: [],
  drawingItemsData: [],
  stabilityTrackerItemsData: [],
  abTrailsItemsData: [],
  flankerItemsData: [],
});

export const prepareData = async (
  data: ExportDataResult,
  getDecryptedAnswers: ReturnType<typeof useDecryptedActivityData>,
) => {
  const parsedAnswers = await getParsedAnswers(data, getDecryptedAnswers);
  const remappedParsedAnswers = remapFailedAnswers(parsedAnswers);
  const parsedAnswersWithPublicUrls = await getAnswersWithPublicUrls(remappedParsedAnswers);
  let acc: AppletExportData = getDefaultExportData();

  for await (const data of parsedAnswersWithPublicUrls) {
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
    const drawingItemsData = await getDrawingItemsData(acc.drawingItemsData, data.decryptedAnswers);
    const stabilityTrackerItemsData = await getStabilityTrackerItemsData(
      acc.stabilityTrackerItemsData,
      data.decryptedAnswers,
    );
    const abTrailsItemsData = await getABTrailsItemsData(
      acc.abTrailsItemsData,
      data.decryptedAnswers,
    );
    const flankerItemsData = await getFlankerItemsData(acc.flankerItemsData, data.decryptedAnswers);

    acc = {
      reportData,
      activityJourneyData,
      mediaData,
      drawingItemsData,
      stabilityTrackerItemsData,
      abTrailsItemsData,
      flankerItemsData,
    };
  }

  return acc;
};
