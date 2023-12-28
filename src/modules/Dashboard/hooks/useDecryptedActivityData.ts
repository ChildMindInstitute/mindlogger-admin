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

  return async <T extends EncryptedAnswerSharedProps>(
    answersApiResponse: T,
  ): Promise<DecryptedActivityData<T>> => {
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
      const key = await getAESKey(privateKey, userPublicKeyParsed, prime, base);

      try {
        answersDecrypted = JSON.parse(
          await decryptData({
            text: answer,
            key,
          }),
        );
      } catch (error) {
        console.warn('Error while answer parsing:', error);
      }

      if (events) {
        try {
          eventsDecrypted = JSON.parse(
            await decryptData({
              text: events,
              key,
            }),
          );
        } catch (error) {
          console.warn('Error while answer parsing:', error);
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

    const answerDataDecrypted = rest.items.map((activityItem, index) => ({
      activityItem,
      answer: getAnswer(activityItem, index),
      ...rest,
    }));

    return {
      decryptedAnswers: answerDataDecrypted as DecryptedActivityData<T>['decryptedAnswers'],
      decryptedEvents: eventsDecrypted,
    };
  };
};
