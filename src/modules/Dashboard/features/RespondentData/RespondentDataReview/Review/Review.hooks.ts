import { useParams } from 'react-router-dom';

import { applet } from 'shared/state';
import { decryptData, getAESKey, getParsedEncryptionFromServer } from 'shared/utils';
import { useEncryptionCheckFromStorage } from 'shared/hooks';

import { ActivityItemAnswer } from '../Feedback/FeedbackReviewed/FeedbackReviewed.types';

export const useDecryptedReviews = (userPublicKey = '') => {
  const { appletId = '' } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const encryption = appletData?.encryption;
  const encryptionInfoFromServer = getParsedEncryptionFromServer(encryption!);
  const { getAppletPrivateKey } = useEncryptionCheckFromStorage();
  if (!encryptionInfoFromServer) return () => [];

  const { prime, base } = encryptionInfoFromServer;
  const privateKey = getAppletPrivateKey(appletId);
  let userPublicKeyParsed = [];
  try {
    userPublicKeyParsed = JSON.parse(userPublicKey);
  } catch {
    console.log('Error while user public key parsing');
  }
  const key = getAESKey(privateKey, userPublicKeyParsed, prime, base);

  return (itemAnswers: ActivityItemAnswer[]): ActivityItemAnswer[] =>
    itemAnswers.map((itemAnswer) => {
      try {
        return {
          ...itemAnswer,
          answer: JSON.parse(
            decryptData({
              text: itemAnswer.answer as string,
              key,
            }),
          ),
        };
      } catch {
        console.log('Error while answer parsing');

        return itemAnswer;
      }
    });
};
