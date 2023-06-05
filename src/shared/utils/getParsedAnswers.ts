import { AxiosResponse } from 'axios';

import { getObjectFromList } from 'shared/utils/builderHelpers';
import {
  ExportActivity,
  ExportAnswer,
} from 'shared/features/AppletSettings/ExportDataSetting/ExportDataSetting.types';
import { AnswersApiResponse } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Review/Review.types';
import { ActivityItemAnswer } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/FeedbackReviewed/FeedbackReviewed.types';

export const getParsedAnswers = (
  res: AxiosResponse,
  getDecryptedReviews: (data: AnswersApiResponse) => ActivityItemAnswer[],
) => {
  if (!res?.data?.result) return;

  const activitiesObject = getObjectFromList(
    res.data.result.activities,
    (activity: ExportActivity) => activity.idVersion,
  );

  return (res.data.result.answers as ExportAnswer[]).map((answer) =>
    getDecryptedReviews({
      userPublicKey: answer.userPublicKey,
      answer: answer.answer,
      itemIds: answer.itemIds,
      items: activitiesObject[answer.activityHistoryId].items,
    } as AnswersApiResponse),
  );
};
