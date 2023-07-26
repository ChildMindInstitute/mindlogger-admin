import { useParams } from 'react-router-dom';

import { applet } from 'shared/state';
import { decryptData, Encryption, getAESKey, getParsedEncryptionFromServer } from 'shared/utils';
import { useEncryptionStorage } from 'shared/hooks/useEncryptionStorage';
import {
  AnswerDTO,
  DecryptedActivityData,
  EncryptedAnswerSharedProps,
  EventDTO,
} from 'shared/types';

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
  const { getAppletPrivateKey } = useEncryptionStorage();

  if (!encryptionInfoFromServer) return getEmptyDecryptedActivityData;
  const { prime, base } = encryptionInfoFromServer;

  return <T extends EncryptedAnswerSharedProps>(
    answersApiResponse: T,
  ): DecryptedActivityData<T> => {
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
      const privateKey = getAppletPrivateKey(dynamicAppletId ?? appletId);
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

    const answerDataDecrypted: DecryptedActivityData<T>['decryptedAnswers'] = rest.items.map(
      (activityItem, index) => ({
        activityItem,
        answer: answersDecrypted[index],
        ...rest,
      }),
    );

    return {
      decryptedAnswers: answerDataDecrypted,
      decryptedEvents: eventsDecrypted,
    };
  };
};
