import {
  AnswerDTO,
  DecryptedAnswerData,
  EventDTO,
  ExportActivity,
  ExportDataResult,
  ExtendedExportAnswerWithoutEncryption,
  isDrawingAnswerData,
  isNotMediaAnswerData,
} from 'shared/types';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { ItemsWithFileResponses } from 'shared/consts';
import { postFilePresignApi } from 'shared/api';

import { getDrawingUrl, getMediaUrl } from './exportData/getUrls';
import { getObjectFromList } from './builderHelpers';

export const getParsedAnswers = (
  result: ExportDataResult,
  getDecryptedActivityData: ReturnType<typeof useDecryptedActivityData>,
) => {
  const activitiesObject = getObjectFromList(
    result.activities,
    (activity: ExportActivity) => activity.idVersion,
  );

  return result.answers.map((answer) =>
    getDecryptedActivityData({
      ...answer,
      items: activitiesObject[answer.activityHistoryId].items,
      activityName: activitiesObject[answer.activityHistoryId].name,
      subscaleSetting: activitiesObject[answer.activityHistoryId].subscaleSetting,
    }),
  );
};

export const getAnswersWithPublicUrls = async (
  parsedAnswers: ReturnType<typeof getParsedAnswers>,
) => {
  const privateUrls = parsedAnswers.reduce((acc, data) => {
    const decryptedAnswers = data.decryptedAnswers.reduce((urlsAcc, item) => {
      if (isDrawingAnswerData(item)) {
        return urlsAcc.concat(getDrawingUrl(item));
      }
      const responseType = item.activityItem?.responseType;
      if (!ItemsWithFileResponses.includes(responseType)) return urlsAcc;

      return urlsAcc.concat(getMediaUrl(item));
    }, [] as string[]);

    return acc.concat(decryptedAnswers);
  }, [] as string[]);

  let publicUrls: string[] = [];
  try {
    const appletId = parsedAnswers[0].decryptedAnswers[0].appletId;
    publicUrls = (await postFilePresignApi(appletId, privateUrls)).data?.result ?? [];
  } catch (e) {
    console.warn(e);
  }
  let publicUrlIndex = 0;

  return parsedAnswers.reduce<ReturnType<typeof getParsedAnswers>>((acc, data) => {
    const decryptedAnswers = data.decryptedAnswers.reduce(
      (
        decryptedAnswersAcc: DecryptedAnswerData<
          ExtendedExportAnswerWithoutEncryption<AnswerDTO, EventDTO>
        >[],
        item,
      ) => {
        if (isDrawingAnswerData(item)) {
          return decryptedAnswersAcc.concat({
            ...item,
            answer: {
              ...item.answer,
              value: {
                ...item.answer.value,
                uri: publicUrls[publicUrlIndex++] ?? '',
              },
            },
          });
        }
        if (isNotMediaAnswerData(item)) return decryptedAnswersAcc.concat(item);

        return decryptedAnswersAcc.concat({
          ...item,
          answer: {
            ...item.answer,
            value: publicUrls[publicUrlIndex++] ?? '',
          },
        });
      },
      [],
    );

    return acc.concat({
      ...data,
      decryptedAnswers,
    });
  }, []);
};
