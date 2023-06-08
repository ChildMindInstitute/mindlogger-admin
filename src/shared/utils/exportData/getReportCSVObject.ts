import { DecryptedAnswerData } from 'shared/types';

export const getReportCSVObject = (item: DecryptedAnswerData) => ({
  id: item.id,
  secret_user_id: item.respondentSecretId,
  userId: item.respondentId,
  activity_id: item.activityId,
  activity_name: item.activityName,
  activity_flow: item.flowId,
  item: item.activityItem?.name,
  version: item.version,
  reviewing_id: item.reviewedAnswerId,
});
