import {
  DecryptedActivityData,
  DecryptedAnswerData,
  ExportActivity,
  ExportAnswer,
  ExtendedExportAnswer,
} from 'shared/types';
import { getObjectFromList } from 'shared/utils/builderHelpers';
import { ResponseValues } from 'shared/state';
import { AnswerDTO } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

import { getParsedAnswers } from '../getParsedAnswers';
import { getReportCSVObject } from './getReportCSVObject';
import { getJourneyCSVObject } from './getJourneyCSVObject';
import { getSubscales } from './getSubscales';

const getDecryptedAnswersObject = (decryptedAnswers: DecryptedAnswerData[]) =>
  getObjectFromList(decryptedAnswers, (item) => `${item.activityId}/${item.activityItem.id}`);

export type ActivityItems = Record<
  string,
  {
    options: ResponseValues;
    answer: AnswerDTO;
  }
> & { sex?: AnswerDTO; age?: AnswerDTO; activityId?: string };

export const prepareData = (
  data: { activities: ExportActivity[]; answers: ExportAnswer[] },
  getDecryptedAnswers: (data: ExtendedExportAnswer) => DecryptedActivityData,
) => {
  const parsedAnswers = getParsedAnswers(data, getDecryptedAnswers);
  console.log(parsedAnswers);

  return parsedAnswers.reduce(
    (acc, data) => {
      const activityItems: ActivityItems = {};
      const answers = data.decryptedAnswers.reduce((filteredAcc, item) => {
        activityItems[item.activityItem.id as keyof ActivityItems] = {
          options: item.activityItem?.responseValues,
          answer: item.answer,
        };
        if (item.activityItem.name === 'gender_screen') {
          activityItems.sex = item.answer;
        }
        if (item.activityItem.name === 'age_screen') {
          activityItems.age = item.answer;
        }
        activityItems.activityId = item.activityId;

        if (item.activityItem?.config?.skippableItem) return filteredAcc;

        return filteredAcc.concat(getReportCSVObject(item));
      }, [] as ReturnType<typeof getReportCSVObject>[]);

      const subscaleSetting = data.decryptedAnswers?.[0]?.subscaleSetting;
      if (subscaleSetting?.subscales?.length) {
        answers.splice(0, 1, {
          ...answers[0],
          ...getSubscales(subscaleSetting, activityItems, answers),
        });
      }

      const reportData = acc.reportData.concat(answers);

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
