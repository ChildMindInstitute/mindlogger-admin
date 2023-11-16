import { useParams } from 'react-router-dom';

import { applet, Item } from 'shared/state';
import {
  decryptData,
  Encryption,
  getAESKey,
  getObjectFromList,
  getParsedEncryptionFromServer,
} from 'shared/utils';
import { useEncryptionStorage } from 'shared/hooks';
import {
  AnswerDTO,
  DecryptedActivityData,
  DecryptedDrawingAnswer,
  EncryptedAnswerSharedProps,
  EventDTO,
} from 'shared/types';
import { ItemResponseType } from 'shared/consts';

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
    const { userPublicKey, answer, itemIds, events, migratedData, ...rest } = answersApiResponse;

    const migratedUrls =
      migratedData?.decryptedFileAnswers &&
      getObjectFromList(migratedData.decryptedFileAnswers, (item) => item.answerItemId);

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

    const getAnswer = (activityItem: Item, index: number): AnswerDTO => {
      const answer = answersDecrypted[index];

      if (!migratedUrls) {
        return answer;
      }

      const migratedUrl = migratedUrls[activityItem?.id as keyof typeof migratedUrls];

      if (migratedUrl && typeof answer === 'object') {
        if (activityItem.responseType === ItemResponseType.Drawing) {
          const drawerAnswer = answer as DecryptedDrawingAnswer;

          return {
            ...drawerAnswer,
            value: {
              ...drawerAnswer.value,
              uri: migratedUrl?.fileUrl,
            },
          };
        }

        return {
          ...answer,
          value: migratedUrl.fileUrl,
        };
      }

      return answer;
    };

    const answerDataDecrypted: DecryptedActivityData<T>['decryptedAnswers'] = rest.items.map(
      (activityItem, index) => ({
        activityItem,
        answer: getAnswer(activityItem, index),
        ...rest,
      }),
    );

    return {
      decryptedAnswers: answerDataDecrypted,
      decryptedEvents: eventsDecrypted,
    };
  };
};
