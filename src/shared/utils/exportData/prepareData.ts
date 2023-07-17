import {
  AppletExportData,
  DecryptedABTrailsAnswer,
  DecryptedActivityData,
  DecryptedAnswerData,
  DecryptedDrawingAnswer,
  DecryptedMediaAnswer,
  DecryptedStabilityTrackerAnswer,
  EventDTO,
  ExportActivity,
  ExportCsvData,
  ExportMediaData,
  ExtendedExportAnswer,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';
import { ItemResponseType, ItemsWithFileResponses } from 'shared/consts';
import {
  getObjectFromList,
  convertJsonToCsv,
  getStabilityRecords,
  getStabilityTrackerCsvName,
  getABTrailsCsvName,
  getMediaFileName,
  getFileExtension,
  getSplashScreen,
} from 'shared/utils';

import { getParsedAnswers } from '../getParsedAnswers';
import { getReportCSVObject } from './getReportCSVObject';
import { getJourneyCSVObject } from './getJourneyCSVObject';
import { getSubscales } from './getSubscales';
import { getDrawingLines } from './getDrawingLines';
import { getABTrailsRecords } from './getABTrailsRecords';

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
      return filteredAcc.concat({
        fileName: getMediaFileName(item, 'svg'),
        url: (item.answer as DecryptedDrawingAnswer).value.uri,
      });

    if (!ItemsWithFileResponses.includes(responseType)) return filteredAcc;

    return filteredAcc.concat({
      fileName: getMediaFileName(
        item,
        getFileExtension((item.answer as DecryptedMediaAnswer).value),
      ),
      url: (item.answer as DecryptedMediaAnswer).value || '',
    });
  }, [] as ExportMediaData[]);

  return mediaData.concat(...mediaAnswers);
};

const getActivityJourneyData = (
  activityJourneyData: AppletExportData['activityJourneyData'],
  rawAnswersObject: Record<string, DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>>,
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
  decryptedEvents: EventDTO[],
) => {
  const decryptedAnswersObject = getDecryptedAnswersObject(decryptedAnswers);
  const events = decryptedEvents.map((event, index, events) => {
    if (index === 0 && !decryptedAnswersObject[event.screen] && events[index + 1])
      return getSplashScreen(event, {
        ...events[index + 1],
        ...decryptedAnswersObject[events[index + 1].screen],
      });

    return getJourneyCSVObject({
      event: {
        ...event,
        ...decryptedAnswersObject[event.screen],
      },
      rawAnswersObject,
    });
  });

  return activityJourneyData.concat(...events).filter(Boolean);
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
      name: getMediaFileName(item, 'csv'),
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

const getABTrailsItemsData = (
  abTrackerItemsData: AppletExportData['abTrailsItemsData'],
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const abTrackerAnswers = decryptedAnswers.reduce((acc, item, index) => {
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.ABTrails) return acc;

    const abTrackerValue = (item.answer as DecryptedABTrailsAnswer).value;

    return acc.concat({
      name: getABTrailsCsvName(index, item.respondentId),
      data: convertJsonToCsv(getABTrailsRecords(abTrackerValue.lines, abTrackerValue.width || 100)),
    });
  }, [] as ExportCsvData[]);

  return abTrackerItemsData.concat(...abTrackerAnswers);
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
      const abTrailsItemsData = getABTrailsItemsData(acc.abTrailsItemsData, data.decryptedAnswers);

      return {
        reportData,
        activityJourneyData,
        mediaData,
        drawingItemsData,
        stabilityTrackerItemsData,
        abTrailsItemsData,
      };
    },
    {
      reportData: [],
      activityJourneyData: [],
      mediaData: [],
      drawingItemsData: [],
      stabilityTrackerItemsData: [],
      abTrailsItemsData: [],
    } as AppletExportData,
  );
};
