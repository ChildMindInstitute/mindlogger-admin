import { useParams } from 'react-router-dom';

import { applet, Item } from 'shared/state';
import {
  decryptData,
  Encryption,
  getAESKey,
  getObjectFromList,
  getParsedEncryptionFromServer,
  logDataInDebugMode,
} from 'shared/utils';
import { useEncryptionStorage } from 'shared/hooks';
import {
  ActivityItemAnswer,
  AnswerDTO,
  DecryptedActivityData,
  DecryptedAnswerData,
  DecryptedDrawingAnswer,
  EncryptedAnswerSharedProps,
  EventDTO,
  ExportAnswer,
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
  const encryptionInfoFromServer = getParsedEncryptionFromServer(dynamicEncryption ?? encryption);
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

    /*
    Here we use 'unknown' because of differences in API responses when Export Data
    and in Datawiz.
    Thus, in dataviz summary the responses are retrived without details about:
    'version', 'client.appId', 'client.appVersion'
    */
    logDataInDebugMode({
      [`applet_v.${(rest as unknown as ExportAnswer)?.version ?? ''}/appId_${
        (rest as unknown as ExportAnswer)?.client?.appId ?? ''
      }/appVersion_${(rest as unknown as ExportAnswer)?.client?.appVersion ?? ''}`]: {
        answersDecrypted,
        eventsDecrypted,
        ...rest,
      },
    });

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

    /*
    Mapping should go through all list of items since the decrypted items MUST have the same length,
    that means we do identify the decrypted answer with the according item and respective item type and item config.

    So if a hidden item have no an answer on Mobile App or Web App
    then Mobile/Web app should prepare `null` value for such reponses to support
    the LEGACY/migrated responses from all respondents.

    For ex.,
    if activity items = [
      { ...text item data },
      { ...single selection item data },
      { ...multi selection item data }
    ],
    and fist item was HIDDEN and third item was SKIPPED on Mobile/Web platform during the activity,
    then Admin Panel expect to receive decrypted answers in this form:
    responses = [
      null, // index = 0, answer for text item = null;
      { "value": 0 }, // index = 1, answer for single selection item = { "value": 0 };
      null // index = 2, answer for multi selection item = null;
    ]
    */
    const answerDataDecrypted = rest.items.reduce(
      (acc: DecryptedActivityData<T>['decryptedAnswers'], activityItem, index) => {
        if (activityItem.isHidden) return acc;

        return acc.concat({
          activityItem,
          answer: getAnswer(activityItem, index),
          ...rest,
        } as DecryptedAnswerData<T, ActivityItemAnswer>);
      },
      [],
    );

    return {
      decryptedAnswers: answerDataDecrypted,
      decryptedEvents: eventsDecrypted,
    };
  };
};
