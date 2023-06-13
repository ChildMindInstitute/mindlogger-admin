import { useParams } from 'react-router-dom';

import { applet } from 'shared/state';
import { decryptData, getAESKey, getParsedEncryptionFromServer } from 'shared/utils';
import { useEncryptionCheckFromStorage } from 'shared/hooks';
import { DecryptedAnswerData, ExtendedExportAnswer, AnswerDecrypted } from 'shared/types';

export const useDecryptedAnswers = () => {
  const { appletId = '' } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const encryption = appletData?.encryption;
  const encryptionInfoFromServer = getParsedEncryptionFromServer(encryption!);
  const { getAppletPrivateKey } = useEncryptionCheckFromStorage();
  if (!encryptionInfoFromServer) return () => [];

  const { prime, base } = encryptionInfoFromServer;
  const privateKey = getAppletPrivateKey(appletId);

  return (answersApiResponse: ExtendedExportAnswer): DecryptedAnswerData[] => {
    const { userPublicKey, answer, items, itemIds, ...rest } = answersApiResponse;

    let answersDecrypted: AnswerDecrypted[] = [];

    if (userPublicKey && answer) {
      let userPublicKeyParsed;
      try {
        userPublicKeyParsed = JSON.parse(userPublicKey);
      } catch {
        userPublicKeyParsed = userPublicKey;
      }

      const key = getAESKey(privateKey, userPublicKeyParsed, prime, base);

      try {
        answersDecrypted = JSON.parse(
          decryptData({
            text: answer,
            key,
          }),
        );
      } catch {
        console.warn('Error while answer parsing');

        return [];
      }
    }

    return items.map((activityItem, index) => ({
      activityItem,
      answer: answersDecrypted[index],
      ...rest,
    }));
  };
};
