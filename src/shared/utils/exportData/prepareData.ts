import {
  DecryptedActivityData,
  DecryptedAnswerData,
  ExportActivity,
  ExtendedExportAnswer,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';
import { getObjectFromList } from 'shared/utils/builderHelpers';
import { ItemsWithFileResponses } from 'shared/consts';

import { getParsedAnswers } from '../getParsedAnswers';
import { getReportCSVObject } from './getReportCSVObject';
import { getJourneyCSVObject } from './getJourneyCSVObject';
import { getSubscales } from './getSubscales';
import { getMediaObject } from './getMediaObject';

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
        if (item.activityItem?.config?.skippableItem) return filteredAcc;

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
        if (!ItemsWithFileResponses.includes(item.activityItem?.responseType)) return filteredAcc;

        return filteredAcc.concat(getMediaObject(item));
      }, [] as ReturnType<typeof getMediaObject>[]);
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

      return {
        reportData,
        activityJourneyData,
        mediaData,
      };
    },
    {
      reportData: [],
      activityJourneyData: [],
      mediaData: [],
    } as {
      reportData: ReturnType<typeof getReportCSVObject>[];
      activityJourneyData: ReturnType<typeof getJourneyCSVObject>[];
      mediaData: ReturnType<typeof getMediaObject>[];
    },
  );
};
