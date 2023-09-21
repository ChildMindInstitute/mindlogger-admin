import { getObjectFromList } from 'shared/utils/builderHelpers';
import {
  DecryptedActivityData,
  ExportActivity,
  ExtendedExportAnswer,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';

export const getParsedAnswers = (
  result: { activities: ExportActivity[]; answers: ExtendedExportAnswer[] },
  getDecryptedActivityData: (
    data: ExtendedExportAnswer,
  ) => DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>,
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
