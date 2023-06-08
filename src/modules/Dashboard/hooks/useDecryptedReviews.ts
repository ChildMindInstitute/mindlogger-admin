import { useParams } from 'react-router-dom';

import { applet } from 'shared/state';
import {
  decryptData,
  getAESKey,
  getObjectFromList,
  getParsedEncryptionFromServer,
} from 'shared/utils';
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
    const itemsObject = getObjectFromList(items);
    let userPublicKeyParsed = [];
    try {
      userPublicKeyParsed = JSON.parse(userPublicKey);
    } catch {
      console.warn('Error while user public key parsing');

      return [];
    }
    const key = getAESKey(privateKey, userPublicKeyParsed, prime, base);

    let answersDecrypted: AnswerDecrypted[] = [];
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

    return answersDecrypted.map((answerDecrypted, index) => {
      const itemId = itemIds[index];
      const activityItem = itemsObject[itemId];

      return {
        activityItem,
        answer: answerDecrypted,
        ...rest,
      };
    });
  };
};
