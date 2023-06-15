import {
  DecryptedActivityData,
  ExportActivity,
  ExportAnswer,
  ExtendedExportAnswer,
} from 'shared/types';

import { getParsedAnswers } from '../getParsedAnswers';
import { getReportCSVObject } from './getReportCSVObject';

export const prepareData = (
  data: { activities: ExportActivity[]; answers: ExportAnswer[] },
  getDecryptedAnswers: (data: ExtendedExportAnswer) => DecryptedActivityData,
) => {
  const parsedAnswers = getParsedAnswers(data, getDecryptedAnswers);

  const reportData = [];
  const activityJourneyData = [];
  const flattenAnswers = parsedAnswers.map((item) => item.decryptedAnswers).flat();

  for (const item of flattenAnswers) {
    reportData.push(getReportCSVObject(item));
    activityJourneyData.push({});
  }

  return {
    reportData,
    activityJourneyData,
  };
};

export const getEmptyDecryptedActivityData = () => ({
  decryptedAnswers: [],
  decryptedEvents: [],
});
