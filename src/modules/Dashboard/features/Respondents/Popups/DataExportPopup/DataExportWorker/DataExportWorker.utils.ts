import {
  DecryptedActivityData,
  ExportActivity,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types/answer';
import { getObjectFromList } from 'shared/utils/getObjectFromList';
import { getDecryptedAnswers } from 'shared/utils/exportData/getDecryptedAnswers';

import { GetDecryptedParsedAnswers } from './DataExportWorker.types';

export const getDecryptedParsedAnswers = async ({
  exportDataResult,
  encryptionInfoFromServer,
  privateKey,
  shouldLogDataInDebugMode,
  itemResponseTypeEnum,
}: GetDecryptedParsedAnswers): Promise<
  DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>[]
> => {
  const activitiesObject = getObjectFromList(
    exportDataResult.activities,
    (activity: ExportActivity) => activity.idVersion,
  );

  const { answers } = exportDataResult;
  const parsedAnswers: DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>[] = [];
  for await (const answer of answers) {
    parsedAnswers.push(
      await getDecryptedAnswers(
        {
          ...answer,
          items: activitiesObject[answer.activityHistoryId].items,
          activityName: activitiesObject[answer.activityHistoryId].name,
          subscaleSetting: activitiesObject[answer.activityHistoryId].subscaleSetting,
        },
        encryptionInfoFromServer,
        privateKey,
        shouldLogDataInDebugMode,
        itemResponseTypeEnum,
      ),
    );
  }

  return parsedAnswers;
};
