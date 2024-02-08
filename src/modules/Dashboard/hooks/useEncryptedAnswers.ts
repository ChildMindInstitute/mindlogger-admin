import { useParams } from 'react-router-dom';

import { auth } from 'redux/modules';
import { useEncryptionStorage } from 'shared/hooks';
import { applet } from 'shared/state';
import { AnswerDTO } from 'shared/types';
import { encryptData, getAESKey, getParsedEncryptionFromServer } from 'shared/utils';

export const useEncryptedAnswers = () => {
  const userData = auth.useData();
  const { id: accountId = '' } = userData?.user || {};
  const { appletId = '' } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const encryption = appletData?.encryption || null;
  const encryptionInfoFromServer = getParsedEncryptionFromServer(encryption!);
  const { getAppletPrivateKey } = useEncryptionStorage();
  if (!encryptionInfoFromServer) return null;

  const { prime, base } = encryptionInfoFromServer;
  const privateKey = getAppletPrivateKey(appletId);

  return async (answers: AnswerDTO[]): Promise<string> => {
    const key = await getAESKey(privateKey, accountId, prime, base);
    let answersEncrypted = '';
    try {
      answersEncrypted = await encryptData({
        text: JSON.stringify(answers),
        key,
      });
    } catch {
      console.warn('Error while answer parsing');
    }

    return answersEncrypted;
  };
};
