import { DecryptedAnswerData } from 'shared/types';

export const getReportCSVObject = (item: DecryptedAnswerData) => ({
  id: item.id,
  secret_user_id: item.respondentSecretId,
  userId: item.respondentId,
});
