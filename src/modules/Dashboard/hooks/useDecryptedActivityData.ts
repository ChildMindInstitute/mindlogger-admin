import { useParams } from 'react-router-dom';

import { applet } from 'shared/state';
import {
  decryptData,
  getAESKey,
  getEmptyDecryptedActivityData,
  getParsedEncryptionFromServer,
} from 'shared/utils';
import { useEncryptionCheckFromStorage } from 'shared/hooks';
import { DecryptedActivityData, ExtendedExportAnswer } from 'shared/types';
import {
  AnswerDTO,
  EventDTO,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export const useDecryptedActivityData = () => {
  const { appletId = '' } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const encryption = appletData?.encryption;
  const encryptionInfoFromServer = getParsedEncryptionFromServer(encryption!);
  const { getAppletPrivateKey } = useEncryptionCheckFromStorage();
  if (!encryptionInfoFromServer) return getEmptyDecryptedActivityData;

  const { prime, base } = encryptionInfoFromServer;
  const privateKey = getAppletPrivateKey(appletId);

  return (answersApiResponse: ExtendedExportAnswer): DecryptedActivityData => {
    const { userPublicKey, answer, items, itemIds, events, ...rest } = answersApiResponse;

    let answersDecrypted: AnswerDTO[] = [];
    let eventsDecrypted: EventDTO[] = [];

    if (!userPublicKey) return getEmptyDecryptedActivityData();

    let userPublicKeyParsed;
    try {
      userPublicKeyParsed = JSON.parse(userPublicKey);
    } catch {
      userPublicKeyParsed = userPublicKey;
    }
    const key = getAESKey(privateKey, userPublicKeyParsed, prime, base);

    if (answer) {
      try {
        answersDecrypted = JSON.parse(
          decryptData({
            text: answer,
            key,
          }),
        );
      } catch {
        console.warn('Error while answer parsing');
      }
    }

    if (events) {
      try {
        eventsDecrypted = JSON.parse(
          decryptData({
            text: events,
            key,
          }),
        );
      } catch {
        console.warn('Error while answer parsing');
      }
    }

    const answerDataDecrypted = items.map((activityItem, index) => ({
      activityItem,
      answer: answersDecrypted[index],
      ...rest,
    }));

    return {
      decryptedAnswers: answerDataDecrypted,
      decryptedEvents: eventsDecrypted,
    };
  };
};
