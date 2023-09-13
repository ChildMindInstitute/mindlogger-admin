import {
  AppletExportData,
  DecryptedABTrailsAnswer,
  DecryptedActivityData,
  DecryptedAnswerData,
  DecryptedDrawingAnswer,
  DecryptedFlankerAnswer,
  DecryptedMediaAnswer,
  DecryptedStabilityTrackerAnswer,
  EventDTO,
  ExportActivity,
  ExportCsvData,
  ExportMediaData,
  ExtendedExportAnswer,
  ExtendedExportAnswerWithoutEncryption,
  UserActionType,
} from 'shared/types';
import { ItemResponseType, ItemsWithFileResponses } from 'shared/consts';
import {
  convertJsonToCsv,
  getABTrailsCsvName,
  getFileExtension,
  getFlankerCsvName,
  getFlankerRecords,
  getMediaFileName,
  getObjectFromList,
  getSplashScreen,
  getStabilityRecords,
  getStabilityTrackerCsvName,
} from 'shared/utils';
import { FlankerConfig, Item } from 'shared/state';
import { postFilePresignApi } from 'shared/api';

import { getParsedAnswers } from '../getParsedAnswers';
import { getReportCSVObject } from './getReportCSVObject';
import { getJourneyCSVObject } from './getJourneyCSVObject';
import { getSubscales } from './getSubscales';
import { getDrawingLines } from './getDrawingLines';
import { getABTrailsRecords } from './getABTrailsRecords';
import { convertDateStampToMs } from './convertDateStampToMs';

const getDecryptedAnswersObject = (
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => getObjectFromList(decryptedAnswers, (item) => `${item.activityId}/${item.activityItem.id}`);

const getReportData = (
  reportData: AppletExportData['reportData'],
  rawAnswersObject: Record<string, DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>>,
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const answers = decryptedAnswers.reduce((filteredAcc, item, index) => {
    if (item.answer === null) return filteredAcc;

    return filteredAcc.concat(
      getReportCSVObject({
        item,
        rawAnswersObject,
        index,
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

const checkIfDrawingMediaConditionPassed = (
  item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
) => item.activityItem?.responseType === ItemResponseType.Drawing && item.answer;
const getDrawingUrl = (item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>) =>
  (item.answer as DecryptedDrawingAnswer).value.uri;
const getMediaUrl = (item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>) =>
  (item.answer as DecryptedMediaAnswer)?.value || '';

const getAnswersWithPublicUrls = async (
  parsedAnswers: DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const privateUrls = parsedAnswers.reduce((acc, data) => {
    const decryptedAnswers = data.decryptedAnswers.reduce((urlsAcc, item) => {
      if (checkIfDrawingMediaConditionPassed(item)) {
        return urlsAcc.concat(getDrawingUrl(item));
      }
      const responseType = item.activityItem?.responseType;
      if (!ItemsWithFileResponses.includes(responseType)) return urlsAcc;

      return urlsAcc.concat(getMediaUrl(item));
    }, [] as string[]);

    return acc.concat(decryptedAnswers);
  }, [] as string[]);

  let publicUrls: string[] = [];
  try {
    const appletId = parsedAnswers[0].decryptedAnswers[0].appletId;
    publicUrls = (await postFilePresignApi(appletId, privateUrls)).data?.result ?? [];
  } catch (e) {
    console.warn(e);
  }
  let publicUrlIndex = 0;

  return parsedAnswers.reduce((acc, data) => {
    const decryptedAnswers = data.decryptedAnswers.reduce((decryptedAnswersAcc, item) => {
      if (checkIfDrawingMediaConditionPassed(item)) {
        return decryptedAnswersAcc.concat({
          ...item,
          answer: {
            ...(item.answer as DecryptedDrawingAnswer),
            value: {
              ...(item.answer as DecryptedDrawingAnswer).value,
              uri: publicUrls[publicUrlIndex++] ?? '',
            },
          },
        });
      }
      const responseType = item.activityItem?.responseType;
      if (!ItemsWithFileResponses.includes(responseType)) return decryptedAnswersAcc.concat(item);

      return decryptedAnswersAcc.concat({
        ...item,
        answer: {
          ...(item.answer as DecryptedMediaAnswer),
          value: publicUrls[publicUrlIndex++] ?? '',
        },
      });
    }, [] as DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[]);

    return acc.concat({
      ...data,
      decryptedAnswers,
    });
  }, [] as DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>[]);
};

const getMediaData = (
  mediaData: AppletExportData['mediaData'],
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const mediaAnswers = decryptedAnswers.reduce((filteredAcc, item) => {
    if (checkIfDrawingMediaConditionPassed(item))
      return filteredAcc.concat({
        fileName: getMediaFileName(item, 'svg'),
        url: getDrawingUrl(item),
      });
    const responseType = item.activityItem?.responseType;
    if (!ItemsWithFileResponses.includes(responseType)) return filteredAcc;
    const url = getMediaUrl(item);

    return filteredAcc.concat({
      fileName: getMediaFileName(item, getFileExtension(url)),
      url,
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
  let indexForABTrailsFiles = 0;
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
      index:
        event.type === UserActionType.SetAnswer ? indexForABTrailsFiles++ : indexForABTrailsFiles,
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
      name: getABTrailsCsvName(index, item.id),
      data: convertJsonToCsv(getABTrailsRecords(abTrackerValue.lines, abTrackerValue.width || 100)),
    });
  }, [] as ExportCsvData[]);

  return abTrackerItemsData.concat(...abTrackerAnswers);
};

const getFlankerItemsData = (
  flankerItemsData: AppletExportData['flankerItemsData'],
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const flankerAnswers = decryptedAnswers.reduce((acc, item) => {
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.Flanker || !item.answer) return acc;

    const flankerValue = (item.answer as DecryptedFlankerAnswer).value;

    return acc.concat({
      name: getFlankerCsvName(item),
      data: convertJsonToCsv(
        getFlankerRecords(
          flankerValue,
          item.activityItem as Item<FlankerConfig>,
          convertDateStampToMs(item.startDatetime),
        ),
      ),
    });
  }, [] as ExportCsvData[]);

  return flankerItemsData.concat(...flankerAnswers);
};

export const prepareData = async (
  data: { activities: ExportActivity[]; answers: ExtendedExportAnswer[] },
  getDecryptedAnswers: (
    data: ExtendedExportAnswer,
  ) => DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>,
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
