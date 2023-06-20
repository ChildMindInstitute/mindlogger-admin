import {
  DecryptedActivityData,
  ExportActivity,
  ExportAnswer,
  ExtendedExportAnswer,
} from 'shared/types';

import { getParsedAnswers } from '../getParsedAnswers';
import { getReportCSVObject } from './getReportCSVObject';

export const prepareData = (
  data: { activities: ExportActivity[]; answers: ExtendedExportAnswer[] },
  getDecryptedAnswers: (data: ExtendedExportAnswer) => DecryptedActivityData<ExportAnswer>,
) => {
  const parsedAnswers = getParsedAnswers(data, getDecryptedAnswers);
  const reportData = [];
  const activityJourneyData = [];
  const flattenAnswers = parsedAnswers
    .flatMap((item) => item.decryptedAnswers)
    ?.filter((item) => !item.activityItem?.config?.skippableItem);
  for (const item of flattenAnswers) {
    reportData.push(getReportCSVObject(item));
    activityJourneyData.push({});
  }

  return {
    reportData,
    activityJourneyData,
  };
};
