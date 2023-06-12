import { getObjectFromList } from 'shared/utils';
import {
  DecryptedAnswerData,
  ExportActivity,
  ExportAnswer,
  ExtendedExportAnswer,
} from 'shared/types';

export const getParsedAnswers = (
  result: { activities: ExportActivity[]; answers: ExportAnswer[] },
  getDecryptedReviews: (data: ExtendedExportAnswer) => DecryptedAnswerData[],
) => {
  const activitiesObject = getObjectFromList(
    result.activities,
    (activity: ExportActivity) => activity.idVersion,
  );

  return result.answers.map((answer: ExportAnswer) =>
    getDecryptedReviews({
      items: activitiesObject[answer.activityHistoryId].items,
      activityName: activitiesObject[answer.activityHistoryId].name,
      ...answer,
    }),
  );
};
