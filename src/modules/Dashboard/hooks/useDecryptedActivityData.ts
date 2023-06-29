import { useRef } from 'react';
import { useParams } from 'react-router-dom';

import { applet } from 'shared/state';
import { decryptData, Encryption, getAESKey, getParsedEncryptionFromServer } from 'shared/utils';
import { useEncryptionCheckFromStorage } from 'shared/hooks';
import { DecryptedActivityData, EncryptedAnswerSharedProps } from 'shared/types';
import {
  AnswerDTO,
  EventDTO,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
export const getEmptyDecryptedActivityData = () => ({
  decryptedAnswers: [],
  decryptedEvents: [],
});

export const useDecryptedActivityData = (
  dynamicAppletId?: string,
  dynamicEncryption?: Encryption,
) => {
  const { appletId = '' } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const encryption = appletData?.encryption;
  const encryptionInfoFromServer = getParsedEncryptionFromServer(dynamicEncryption ?? encryption!);
  const { getAppletPrivateKey } = useEncryptionCheckFromStorage();
  const privateKeyRef = useRef(getAppletPrivateKey(dynamicAppletId ?? appletId));

  if (!encryptionInfoFromServer) return getEmptyDecryptedActivityData;
  const { prime, base } = encryptionInfoFromServer;

  return <T extends EncryptedAnswerSharedProps>(
    answersApiResponse: T,
  ): DecryptedActivityData<T> => {
    if (!privateKeyRef.current) return getEmptyDecryptedActivityData();

    const { userPublicKey, answer, itemIds, events, ...rest } = answersApiResponse;

    let answersDecrypted: AnswerDTO[] = [];
    let eventsDecrypted: EventDTO[] = [];

    if (userPublicKey) {
      let userPublicKeyParsed;
      try {
        userPublicKeyParsed = JSON.parse(userPublicKey);
      } catch {
        userPublicKeyParsed = userPublicKey;
      }
      const key = getAESKey(privateKeyRef.current, userPublicKeyParsed, prime, base);

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
    }

    const answerDataDecrypted = rest.items.map((activityItem, index) => ({
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
