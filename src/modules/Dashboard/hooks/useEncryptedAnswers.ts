import { useParams } from 'react-router-dom';

import { auth } from 'redux/modules';
import { applet } from 'shared/state';
import { encryptData, getAESKey, getParsedEncryptionFromServer } from 'shared/utils';
import { useEncryptionCheckFromStorage } from 'shared/hooks';
import { AnswerDTO } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export const useEncryptedAnswers = () => {
  const userData = auth.useData();
  const { id: accountId = '' } = userData?.user || {};
  const { appletId = '' } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const encryption = appletData?.encryption || null;
  const encryptionInfoFromServer = getParsedEncryptionFromServer(encryption!);
  const { getAppletPrivateKey } = useEncryptionCheckFromStorage();
  if (!encryptionInfoFromServer) return () => [];

  const { prime, base } = encryptionInfoFromServer;
  const privateKey = getAppletPrivateKey(appletId);

  return (answers: AnswerDTO[]): string => {
    const key = getAESKey(privateKey, accountId, prime, base);
    let answersEncrypted = '';
    try {
      answersEncrypted = encryptData({
        text: JSON.stringify(answers),
        key,
      });
    } catch {
      console.warn('Error while answer parsing');
    }

    return answersEncrypted;
  };
};
