import {
  DecryptedActivityData,
  DecryptedAnswerData,
  DrawingItemAnswer,
  ExportActivity,
  ExportDataResult,
  ExtendedExportAnswerWithoutEncryption,
  FailedDecryption,
  isDrawingAnswerData,
  isNotMediaAnswerData,
} from 'shared/types';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { postFilePresignApi } from 'shared/api';

import { getDrawingUrl, getMediaUrl } from './exportData/getUrls';
import { getObjectFromList } from './getObjectFromList';
import { isSuccessEvent } from './exportData/getReportAndMediaData';

export const getParsedAnswers = async (
  result: ExportDataResult,
  getDecryptedActivityData: ReturnType<typeof useDecryptedActivityData>,
) => {
  const activitiesObject = getObjectFromList(
    result.activities,
    (activity: ExportActivity) => activity.idVersion,
  );

  const { answers } = result;
  const parsedAnswers = [];
  for await (const answer of answers) {
    parsedAnswers.push(
      await getDecryptedActivityData({
        ...answer,
        items: activitiesObject[answer.activityHistoryId].items,
        activityName: activitiesObject[answer.activityHistoryId].name,
        subscaleSetting: activitiesObject[answer.activityHistoryId].subscaleSetting,
      }),
    );
  }

  return parsedAnswers;
};

export const remapFailedAnswers = (
  parsedAnswers: DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>[],
): Awaited<ReturnType<typeof getParsedAnswers>> => {
  if (!parsedAnswers.length) return [];

  return parsedAnswers.reduce(
    (acc, data) =>
      acc.concat({
        ...data,
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        decryptedEvents: data.decryptedEvents.filter(isSuccessEvent),
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        decryptedAnswers: data.decryptedAnswers.map((item) => {
          if (
            typeof item.answer === 'object' &&
            item.answer !== null &&
            'type' in (item.answer as FailedDecryption) &&
            'screen' in (item.answer as FailedDecryption) &&
            'time' in (item.answer as FailedDecryption)
          ) {
            return {
              ...item,
              answer: null,
            };
          }

          return item;
        }),
      }),
    [],
  );
};

const shouldConvertPrivateDrawingUrl = (
  item: DecryptedAnswerData,
): item is DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption, DrawingItemAnswer> =>
  isDrawingAnswerData(item) && Boolean(item.answer.value.uri);

export const getAnswersWithPublicUrls = async (
  parsedAnswers: Awaited<ReturnType<typeof getParsedAnswers>>,
) => {
  if (!parsedAnswers.length) return [];

  const privateUrls = parsedAnswers.reduce((acc, data) => {
    const decryptedAnswers = data.decryptedAnswers.reduce((urlsAcc, item) => {
      if (shouldConvertPrivateDrawingUrl(item)) {
        return urlsAcc.concat(getDrawingUrl(item));
      }
      if (isNotMediaAnswerData(item)) return urlsAcc;

      return urlsAcc.concat(getMediaUrl(item));
    }, [] as string[]);

    return acc.concat(decryptedAnswers);
  }, [] as string[]);

  let publicUrls: string[] = [];
  if (privateUrls.length) {
    try {
      const appletId = parsedAnswers[0].decryptedAnswers[0].appletId;
      publicUrls = (await postFilePresignApi(appletId, privateUrls)).data?.result ?? [];
    } catch (e) {
      console.warn(e);
    }
  }
  let publicUrlIndex = 0;

  return parsedAnswers.reduce<Awaited<ReturnType<typeof getParsedAnswers>>>((acc, data) => {
    const decryptedAnswers = data.decryptedAnswers.reduce(
      (decryptedAnswersAcc: DecryptedAnswerData[], item) => {
        if (shouldConvertPrivateDrawingUrl(item)) {
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
