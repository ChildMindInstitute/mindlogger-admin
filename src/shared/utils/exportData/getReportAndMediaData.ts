import {
  AppletExportData,
  DecryptedAnswerData,
  EventDTO,
  ExportMediaData,
  isDrawingAnswerData,
  SuccessedEventDTO,
  UserActionType,
} from 'shared/types';
import {
  checkIfHasMigratedAnswers,
  getIdBeforeMigration,
} from 'shared/utils/exportData/migratedData';
import { getReportCSVObject } from 'shared/utils/exportData/getReportCSVObject';
import { getSubscales } from 'shared/utils/exportData/getSubscales';
import { getFileExtension, getMediaFileName } from 'shared/utils/exportData/getReportName';
import { ItemResponseType, ItemsWithFileResponses } from 'shared/consts';
import { getJourneyCSVObject, getSplashScreen } from 'shared/utils/exportData/getJourneyCSVObject';
import { getDrawingUrl, getMediaUrl, getUnityMediaUrls } from 'shared/utils/exportData/getUrls';
import { FeatureFlags } from 'shared/types/featureFlags';

import { getObjectFromList } from '../getObjectFromList';

export const getDecryptedAnswersObject = ({
  decryptedAnswers,
  hasMigratedAnswers,
  hasUrlEventScreen,
}: {
  decryptedAnswers: DecryptedAnswerData[];
  hasMigratedAnswers?: boolean;
  hasUrlEventScreen?: boolean;
}) =>
  getObjectFromList(decryptedAnswers, (item) => {
    if (hasUrlEventScreen) return item.activityItem.name;
    if (hasMigratedAnswers) {
      return `${getIdBeforeMigration(item.activityId)}/${getIdBeforeMigration(
        item.activityItem.id,
      )}`;
    }

    return `${item.activityId}/${item.activityItem.id}`;
  });

export const getReportData = (
  reportData: AppletExportData['reportData'],
  rawAnswersObject: Record<string, DecryptedAnswerData>,
  decryptedAnswers: DecryptedAnswerData[],
  flags: FeatureFlags,
) => {
  const answers = decryptedAnswers.reduce(
    (filteredAcc, item, index) => {
      const shouldSkipItem = item.answer === undefined || item.answer === null;
      if (shouldSkipItem) return filteredAcc;

      return filteredAcc.concat(
        getReportCSVObject({
          item,
          rawAnswersObject,
          index,
          enableDataExportRenaming: !!flags.enableDataExportRenaming,
        }),
      );
    },
    [] as ReturnType<typeof getReportCSVObject>[],
  );

  const subscaleSetting = decryptedAnswers?.[0]?.subscaleSetting;
  if (subscaleSetting?.subscales?.length) {
    answers.splice(0, 1, {
      ...answers[0],
      ...getSubscales(subscaleSetting, rawAnswersObject, flags),
    });
  }

  return reportData.concat(answers);
};

export const getMediaData = (
  mediaData: AppletExportData['mediaData'],
  decryptedAnswers: DecryptedAnswerData[],
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

export const getUnityData = (
  unityData: AppletExportData['unityData'],
  decryptedAnswers: DecryptedAnswerData[],
): ExportMediaData[] => {
  const unityAnswers = decryptedAnswers.reduce((filteredAcc, item) => {
    const responseType = item.activityItem?.responseType;

    if (responseType !== ItemResponseType.Unity) {
      return filteredAcc;
    }

    const mediaData = getUnityMediaUrls(item).map((url) => ({
      fileName: getMediaFileName(item, getFileExtension(url)),
      url,
    }));

    return filteredAcc.concat(mediaData);
  }, [] as ExportMediaData[]);

  return unityData.concat(...unityAnswers);
};

export const searchItemNameInUrlScreen = (screen: string) => screen.split('/').pop() ?? '';
export const checkIfScreenHasUrl = (screen: string) => /^https?:\/\//.test(screen);
// For ex.:
// screen: "https://raw.githubusercontent.com/ChildMindInstitute/NIMH_EMA_applet/master/activities/<activity_name>/items/<item_name>"
export const checkIfHasGithubImportedEventScreen = (decryptedEvents: SuccessedEventDTO[]) => {
  if (!decryptedEvents.length) return false;

  return checkIfScreenHasUrl(decryptedEvents[0]?.screen);
};
export const getEventScreenWrapper =
  ({ hasUrlEventScreen }: { hasUrlEventScreen: boolean }) =>
  (screen: string) => {
    if (!hasUrlEventScreen) return screen;

    return searchItemNameInUrlScreen(screen);
  };

export const isSuccessEvent = (event: EventDTO): event is SuccessedEventDTO =>
  event.type !== '' && event.screen !== '' && event.time !== '';

export const getActivityJourneyData = (
  activityJourneyData: AppletExportData['activityJourneyData'],
  rawAnswersObject: Record<string, DecryptedAnswerData>,
  decryptedAnswers: DecryptedAnswerData[],
  decryptedEvents: EventDTO[],
  { enableDataExportRenaming }: FeatureFlags,
) => {
  const decryptedFilteredEvents = decryptedEvents.filter(isSuccessEvent);
  const hasMigratedAnswers = checkIfHasMigratedAnswers(decryptedAnswers);
  const hasUrlEventScreen = checkIfHasGithubImportedEventScreen(decryptedFilteredEvents);
  const getEventScreen = getEventScreenWrapper({ hasUrlEventScreen });
  const decryptedAnswersObject = getDecryptedAnswersObject({
    decryptedAnswers,
    hasMigratedAnswers,
    hasUrlEventScreen,
  });
  let indexForABTrailsFiles = 0;
  const events = decryptedFilteredEvents.map((event, index, events) => {
    // if Activity has splash screen image (in Builder), the first event will be added as the Splash screen item
    if (index === 0 && !decryptedAnswersObject[getEventScreen(event.screen)] && events[index + 1])
      return getSplashScreen(event, {
        ...events[index + 1],
        ...decryptedAnswersObject[getEventScreen(events[index + 1].screen)],
      });

    return getJourneyCSVObject({
      event: {
        ...event,
        ...decryptedAnswersObject[getEventScreen(event.screen)],
      },
      rawAnswersObject,
      index:
        event.type === UserActionType.SetAnswer ? indexForABTrailsFiles++ : indexForABTrailsFiles,
      enableDataExportRenaming: !!enableDataExportRenaming,
    });
  });

  return activityJourneyData.concat(...events).filter(Boolean);
};
