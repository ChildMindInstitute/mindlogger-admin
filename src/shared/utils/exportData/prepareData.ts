import {
  DecryptedActivityData,
  DecryptedAnswerData,
  DecryptedDrawingAnswer,
  DecryptedMediaAnswer,
  ExportActivity,
  ExportCsvData,
  ExtendedExportAnswer,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';
import { getObjectFromList } from 'shared/utils/builderHelpers';
import { ItemResponseType, ItemsWithFileResponses } from 'shared/consts';
import { convertJsonToCsv } from 'shared/utils/exportTemplate';

import { getParsedAnswers } from '../getParsedAnswers';
import { getReportCSVObject } from './getReportCSVObject';
import { getJourneyCSVObject } from './getJourneyCSVObject';
import { getSubscales } from './getSubscales';
import { getDrawingLines } from './getDrawingLines';

const getDecryptedAnswersObject = (
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => getObjectFromList(decryptedAnswers, (item) => `${item.activityId}/${item.activityItem.id}`);

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
      const answers = data.decryptedAnswers.reduce((filteredAcc, item) => {
        if (item.activityItem?.config?.skippableItem || item.answer === null) return filteredAcc;

        return filteredAcc.concat(
          getReportCSVObject({
            item,
            rawAnswersObject,
          }),
        );
      }, [] as ReturnType<typeof getReportCSVObject>[]);

      const subscaleSetting = data.decryptedAnswers?.[0]?.subscaleSetting;
      if (subscaleSetting?.subscales?.length) {
        answers.splice(0, 1, {
          ...answers[0],
          ...getSubscales(subscaleSetting, rawAnswersObject),
        });
      }
      const reportData = acc.reportData.concat(answers);

      const mediaAnswers = data.decryptedAnswers.reduce((filteredAcc, item) => {
        const responseType = item.activityItem?.responseType;
        if (responseType === ItemResponseType.Drawing && item.answer)
          return filteredAcc.concat((item.answer as DecryptedDrawingAnswer).value.uri);

        if (!ItemsWithFileResponses.includes(responseType)) return filteredAcc;

        return filteredAcc.concat((item.answer as DecryptedMediaAnswer).value || '');
      }, [] as string[]);
      const mediaData = acc.mediaData.concat(...mediaAnswers);

      const decryptedAnswersObject = getDecryptedAnswersObject(data.decryptedAnswers);
      const events = data.decryptedEvents.map((event) =>
        getJourneyCSVObject({
          event: {
            ...event,
            ...decryptedAnswersObject[event.screen],
          },
          rawAnswersObject,
        }),
      );
      const activityJourneyData = acc.activityJourneyData.concat(...events);

      const drawingAnswers = data.decryptedAnswers.reduce((acc, item) => {
        const responseType = item.activityItem?.responseType;
        if (responseType !== ItemResponseType.Drawing || item.answer === null) return acc;
        const drawingValue = (item.answer as DecryptedDrawingAnswer).value;

        return acc.concat({
          name: `${item.respondentId}-${item.activityId}-${item.id}.csv`,
          data: convertJsonToCsv(getDrawingLines(drawingValue.lines, drawingValue.width || 100)),
        });
      }, [] as ExportCsvData[]);
      const drawingItemsData = acc.drawingItemsData.concat(...drawingAnswers);

      return {
        reportData,
        activityJourneyData,
        mediaData,
        drawingItemsData,
      };
    },
    {
      reportData: [],
      activityJourneyData: [],
      mediaData: [],
      drawingItemsData: [],
    } as {
      reportData: ReturnType<typeof getReportCSVObject>[];
      activityJourneyData: ReturnType<typeof getJourneyCSVObject>[];
      mediaData: string[];
      drawingItemsData: ExportCsvData[];
    },
  );
};
