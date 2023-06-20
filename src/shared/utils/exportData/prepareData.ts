import {
  DecryptedActivityData,
  DecryptedAnswerData,
  ExportActivity,
  ExportAnswer,
  ExtendedExportAnswer,
} from 'shared/types';
import { getObjectFromList } from 'shared/utils/builderHelpers';

import { getParsedAnswers } from '../getParsedAnswers';
import { getReportCSVObject } from './getReportCSVObject';
import { getJourneyCSVObject } from './getJourneyCSVObject';

const getDecryptedAnswersObject = (decryptedAnswers: DecryptedAnswerData[]) =>
  getObjectFromList(decryptedAnswers, (item) => `${item.activityId}/${item.activityItem.id}`);

export const prepareData = (
  data: { activities: ExportActivity[]; answers: ExportAnswer[] },
  getDecryptedAnswers: (data: ExtendedExportAnswer) => DecryptedActivityData,
) => {
  const parsedAnswers = getParsedAnswers(data, getDecryptedAnswers);

  return parsedAnswers.reduce(
    (acc, data) => {
      const answers = data.decryptedAnswers.reduce((filteredAcc, item) => {
        if (item.activityItem?.config?.skippableItem) return filteredAcc;

        return filteredAcc.concat(getReportCSVObject(item));
      }, [] as ReturnType<typeof getReportCSVObject>[]);
      const reportData = acc.reportData.concat(...answers);

      const decryptedAnswersObject = getDecryptedAnswersObject(data.decryptedAnswers);
      const events = data.decryptedEvents.map((event) =>
        getJourneyCSVObject({
          ...event,
          ...decryptedAnswersObject[event.screen],
        }),
      );
      const activityJourneyData = acc.activityJourneyData.concat(...events);

      return {
        reportData,
        activityJourneyData,
      };
    },
    {
      reportData: [],
      activityJourneyData: [],
    } as {
      reportData: ReturnType<typeof getReportCSVObject>[];
      activityJourneyData: ReturnType<typeof getJourneyCSVObject>[];
    },
  );
};
