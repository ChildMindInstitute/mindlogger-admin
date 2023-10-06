import {
  AppletExportData,
  DecryptedAnswerData,
  EventDTO,
  ExportMediaData,
  ExtendedExportAnswerWithoutEncryption,
  isDrawingAnswerData,
  UserActionType,
} from 'shared/types';
import { getObjectFromList } from 'shared/utils/builderHelpers';
import {
  checkIfHasMigratedAnswers,
  getIdBeforeMigration,
} from 'shared/utils/exportData/migratedData';
import { getReportCSVObject } from 'shared/utils/exportData/getReportCSVObject';
import { getSubscales } from 'shared/utils/exportData/getSubscales';
import { getFileExtension, getMediaFileName } from 'shared/utils/exportData/getReportName';
import { ItemsWithFileResponses } from 'shared/consts';
import { getJourneyCSVObject, getSplashScreen } from 'shared/utils/exportData/getJourneyCSVObject';
import { getDrawingUrl, getMediaUrl } from 'shared/utils/exportData/getUrls';

const getDecryptedAnswersObject = (
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
  hasMigratedAnswers?: boolean,
) =>
  getObjectFromList(decryptedAnswers, (item) => {
    if (hasMigratedAnswers) {
      return `${getIdBeforeMigration(item.activityId)}/${getIdBeforeMigration(
        item.activityItem.id,
      )}`;
    }

    return `${item.activityId}/${item.activityItem.id}`;
  });

export const getReportData = (
  reportData: AppletExportData['reportData'],
  rawAnswersObject: Record<string, DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>>,
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const answers = decryptedAnswers.reduce(
    (filteredAcc, item, index) => {
      if (item.answer === null) return filteredAcc;

      return filteredAcc.concat(
        getReportCSVObject({
          item,
          rawAnswersObject,
          index,
        }),
      );
    },
    [] as ReturnType<typeof getReportCSVObject>[],
  );

  const subscaleSetting = decryptedAnswers?.[0]?.subscaleSetting;
  if (subscaleSetting?.subscales?.length) {
    answers.splice(0, 1, {
      ...answers[0],
      ...getSubscales(subscaleSetting, rawAnswersObject),
    });
  }

  return reportData.concat(answers);
};

export const getMediaData = (
  mediaData: AppletExportData['mediaData'],
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const mediaAnswers = decryptedAnswers.reduce((filteredAcc, item) => {
    if (isDrawingAnswerData(item))
      return filteredAcc.concat({
        fileName: getMediaFileName(item, 'svg'),
        url: getDrawingUrl(item),
      });
    const responseType = item.activityItem?.responseType;
    const url = getMediaUrl(item);
    if (!ItemsWithFileResponses.includes(responseType) || !url) return filteredAcc;

    return filteredAcc.concat({
      fileName: getMediaFileName(item, getFileExtension(url)),
      url,
    });
  }, [] as ExportMediaData[]);

  return mediaData.concat(...mediaAnswers);
};

export const getActivityJourneyData = (
  activityJourneyData: AppletExportData['activityJourneyData'],
  rawAnswersObject: Record<string, DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>>,
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
  decryptedEvents: EventDTO[],
) => {
  const hasMigratedAnswers = checkIfHasMigratedAnswers(decryptedAnswers);
  const decryptedAnswersObject = getDecryptedAnswersObject(decryptedAnswers, hasMigratedAnswers);
  let indexForABTrailsFiles = 0;
  const events = decryptedEvents.map((event, index, events) => {
    if (index === 0 && !decryptedAnswersObject[event.screen] && events[index + 1])
      return getSplashScreen(event, {
        ...events[index + 1],
        ...decryptedAnswersObject[events[index + 1].screen],
      });

    return getJourneyCSVObject({
      event: {
        ...event,
        ...decryptedAnswersObject[event.screen],
      },
      rawAnswersObject,
      index:
        event.type === UserActionType.SetAnswer ? indexForABTrailsFiles++ : indexForABTrailsFiles,
    });
  });

  return activityJourneyData.concat(...events).filter(Boolean);
};
