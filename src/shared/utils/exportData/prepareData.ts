import {
  AppletExportData,
  DecryptedActivityData,
  DecryptedAnswerData,
  DecryptedDrawingAnswer,
  DecryptedMediaAnswer,
  DecryptedStabilityTrackerAnswer,
  EventDTO,
  ExportActivity,
  ExportCsvData,
  ExtendedExportAnswer,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';
import { ItemResponseType, ItemsWithFileResponses } from 'shared/consts';
import {
  getObjectFromList,
  convertJsonToCsv,
  getStabilityRecords,
  getStabilityTrackerCsvName,
} from 'shared/utils';

import { getParsedAnswers } from '../getParsedAnswers';
import { getReportCSVObject } from './getReportCSVObject';
import { getJourneyCSVObject } from './getJourneyCSVObject';
import { getSubscales } from './getSubscales';
import { getDrawingLines } from './getDrawingLines';

const getDecryptedAnswersObject = (
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => getObjectFromList(decryptedAnswers, (item) => `${item.activityId}/${item.activityItem.id}`);

const getReportData = (
  reportData: AppletExportData['reportData'],
  rawAnswersObject: Record<string, DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>>,
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const answers = decryptedAnswers.reduce((filteredAcc, item) => {
    if (item.activityItem?.config?.skippableItem || item.answer === null) return filteredAcc;

    return filteredAcc.concat(
      getReportCSVObject({
        item,
        rawAnswersObject,
      }),
    );
  }, [] as ReturnType<typeof getReportCSVObject>[]);

  const subscaleSetting = decryptedAnswers?.[0]?.subscaleSetting;
  if (subscaleSetting?.subscales?.length) {
    answers.splice(0, 1, {
      ...answers[0],
      ...getSubscales(subscaleSetting, rawAnswersObject),
    });
  }

  return reportData.concat(answers);
};

const getMediaData = (
  mediaData: AppletExportData['mediaData'],
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const mediaAnswers = decryptedAnswers.reduce((filteredAcc, item) => {
    const responseType = item.activityItem?.responseType;
    if (responseType === ItemResponseType.Drawing && item.answer)
      return filteredAcc.concat((item.answer as DecryptedDrawingAnswer).value.uri);

    if (!ItemsWithFileResponses.includes(responseType)) return filteredAcc;

    return filteredAcc.concat((item.answer as DecryptedMediaAnswer).value || '');
  }, [] as string[]);

  return mediaData.concat(...mediaAnswers);
};

const getActivityJourneyData = (
  activityJourneyData: AppletExportData['activityJourneyData'],
  rawAnswersObject: Record<string, DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>>,
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
  decryptedEvents: EventDTO[],
) => {
  const decryptedAnswersObject = getDecryptedAnswersObject(decryptedAnswers);
  const events = decryptedEvents.map((event) =>
    getJourneyCSVObject({
      event: {
        ...event,
        ...decryptedAnswersObject[event.screen],
      },
      rawAnswersObject,
    }),
  );

  return activityJourneyData.concat(...events);
};

const getDrawingItemsData = (
  drawingItemsData: AppletExportData['drawingItemsData'],
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const drawingAnswers = decryptedAnswers.reduce((acc, item) => {
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.Drawing || item.answer === null) return acc;
    const drawingValue = (item.answer as DecryptedDrawingAnswer).value;

    return acc.concat({
      name: `${item.respondentId}-${item.activityId}-${item.id}.csv`,
      data: convertJsonToCsv(getDrawingLines(drawingValue.lines, drawingValue.width || 100)),
    });
  }, [] as ExportCsvData[]);

  return drawingItemsData.concat(...drawingAnswers);
};
const getStabilityTrackerItemsData = (
  stabilityTrackerItemsData: AppletExportData['stabilityTrackerItemsData'],
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const stabilityTrackerAnswers = decryptedAnswers.reduce((acc, item) => {
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.StabilityTracker) return acc;

    const stabilityTrackerValue = (item.answer as DecryptedStabilityTrackerAnswer).value;

    return acc.concat({
      name: getStabilityTrackerCsvName(item.id, stabilityTrackerValue.phaseType),
      data: convertJsonToCsv(getStabilityRecords(stabilityTrackerValue.value)),
    });
  }, [] as ExportCsvData[]);

  return stabilityTrackerItemsData.concat(...stabilityTrackerAnswers);
};

export const prepareData = (
  data: { activities: ExportActivity[]; answers: ExtendedExportAnswer[] },
  getDecryptedAnswers: (
    data: ExtendedExportAnswer,
  ) => DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>,
) => {
  const parsedAnswers = getParsedAnswers(data, getDecryptedAnswers);

  return parsedAnswers.reduce(
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

      return {
        reportData,
        activityJourneyData,
        mediaData,
        drawingItemsData,
        stabilityTrackerItemsData,
      };
    },
    {
      reportData: [],
      activityJourneyData: [],
      mediaData: [],
      drawingItemsData: [],
      stabilityTrackerItemsData: [],
    } as AppletExportData,
  );
};
