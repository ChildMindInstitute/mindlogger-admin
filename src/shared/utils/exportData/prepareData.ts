import {
  DecryptedAnswerData,
  ExportActivity,
  ExportAnswer,
  ExtendedExportAnswer,
} from 'shared/types';

import { getParsedAnswers } from '../getParsedAnswers';
import { getReportCSVObject } from './getReportCSVObject';

export const prepareData = (
  data: { activities: ExportActivity[]; answers: ExportAnswer[] },
  getDecryptedAnswers: (data: ExtendedExportAnswer) => DecryptedAnswerData[],
) => {
  const parsedAnswers = getParsedAnswers(data, getDecryptedAnswers);
  console.log(parsedAnswers);
  const reportData = [];
  const activityJourneyData = [];
  const flattenAnswers = parsedAnswers.flat();

  for (const item of flattenAnswers) {
    reportData.push(getReportCSVObject(item));
    activityJourneyData.push({});
  }

  return {
    reportData,
    activityJourneyData,
  };
};
