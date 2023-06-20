import { getObjectFromList } from 'shared/utils';
import {
  DecryptedActivityData,
  ExportActivity,
  ExportAnswer,
  ExtendedExportAnswer,
} from 'shared/types';

export const getParsedAnswers = (
  result: { activities: ExportActivity[]; answers: ExtendedExportAnswer[] },
  getDecryptedActivityData: (data: ExtendedExportAnswer) => DecryptedActivityData<ExportAnswer>,
) => {
  const activitiesObject = getObjectFromList(
    result.activities,
    (activity: ExportActivity) => activity.idVersion,
  );

  return result.answers.map((answer: ExtendedExportAnswer) =>
    getDecryptedActivityData({
      ...answer,
      items: activitiesObject[answer.activityHistoryId].items,
      activityName: activitiesObject[answer.activityHistoryId].name,
      subscaleSetting: activitiesObject[answer.activityHistoryId].subscaleSetting,
    }),
  );
};
