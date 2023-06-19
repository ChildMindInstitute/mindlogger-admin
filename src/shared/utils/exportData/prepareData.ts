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
  const reportData = [];
  const activityJourneyData = [];
  const flattenAnswers = parsedAnswers
    .flatMap((item) => item.decryptedAnswers)
    ?.filter((item) => !item.activityItem?.config?.skippableItem);
  const flattenEvents = parsedAnswers.flatMap((item) => {
    const decryptedAnswersObject = getDecryptedAnswersObject(item.decryptedAnswers);

    return item.decryptedEvents.map((event) => ({
      ...event,
      ...decryptedAnswersObject[event.screen],
    }));
  });

  for (const item of flattenAnswers) {
    reportData.push(getReportCSVObject(item));
  }

  for (const event of flattenEvents) {
    activityJourneyData.push(getJourneyCSVObject(event));
  }

  return {
    reportData,
    activityJourneyData,
  };
};
