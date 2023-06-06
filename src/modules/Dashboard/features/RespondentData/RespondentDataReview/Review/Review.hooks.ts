import { useParams } from 'react-router-dom';

import { applet } from 'shared/state';
import {
  decryptData,
  encryptData,
  getAESKey,
  getObjectFromList,
  getParsedEncryptionFromServer,
} from 'shared/utils';
import { useEncryptionCheckFromStorage } from 'shared/hooks';
import { auth } from 'redux/modules';

import { AnswerDecrypted, AnswersApiResponse } from './Review.types';
import { ActivityItemAnswer, ItemAnswer } from '../RespondentDataReview.types';

export const useDecryptedReviews = () => {
  const { appletId = '' } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const encryption = appletData?.encryption;
  const encryptionInfoFromServer = getParsedEncryptionFromServer(encryption!);
  const { getAppletPrivateKey } = useEncryptionCheckFromStorage();
  if (!encryptionInfoFromServer) return () => [];

  const { prime, base } = encryptionInfoFromServer;
  const privateKey = getAppletPrivateKey(appletId);

  return (answersApiResponse: AnswersApiResponse): ActivityItemAnswer[] => {
    const { userPublicKey, answer, items, itemIds } = answersApiResponse;
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
      const activityItem = itemsObject[itemId] as unknown as ActivityItemAnswer['activityItem'];

      return {
        activityItem,
        answer: answerDecrypted,
      };
    });
  };
};

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

  return (answers: ItemAnswer[]): string => {
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
