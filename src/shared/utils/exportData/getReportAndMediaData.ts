// eslint-disable no-console
import { ItemsWithFileResponses } from 'shared/consts';
import {
  AppletExportData,
  DecryptedAnswerData,
  EventDTO,
  ExportMediaData,
  isDrawingAnswerData,
  SuccessedEventDTO,
  UserActionType,
} from 'shared/types';
import { FeatureFlags } from 'shared/types/featureFlags';
import { getJourneyCSVObject, getSplashScreen } from 'shared/utils/exportData/getJourneyCSVObject';
import { getReportCSVObject } from 'shared/utils/exportData/getReportCSVObject';
import { getFileExtension, getMediaFileName } from 'shared/utils/exportData/getReportName';
import { getSubscales } from 'shared/utils/exportData/getSubscales';
import { getDrawingUrl, getMediaUrl } from 'shared/utils/exportData/getUrls';
import {
  checkIfHasMigratedAnswers,
  getIdBeforeMigration,
} from 'shared/utils/exportData/migratedData';

import { getObjectFromList } from '../getObjectFromList';
import { checkIfShouldLogging } from '../logger';

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
  const shouldLogDataInDebugMode = checkIfShouldLogging();

  if (shouldLogDataInDebugMode) {
    console.log(
      `[getActivityJourneyData] Starting with ${decryptedEvents.length} events and ${decryptedAnswers.length} answers`,
    );
  }

  const decryptedFilteredEvents = decryptedEvents.filter(isSuccessEvent);

  if (shouldLogDataInDebugMode) {
    console.log(
      `[getActivityJourneyData] Filtered events from ${decryptedEvents.length} to ${decryptedFilteredEvents.length} successful events`,
    );
  }

  const hasMigratedAnswers = checkIfHasMigratedAnswers(decryptedAnswers);
  const hasUrlEventScreen = checkIfHasGithubImportedEventScreen(decryptedFilteredEvents);

  if (shouldLogDataInDebugMode) {
    console.log(
      `[getActivityJourneyData] hasMigratedAnswers: ${hasMigratedAnswers}, hasUrlEventScreen: ${hasUrlEventScreen}`,
    );
  }

  const getEventScreen = getEventScreenWrapper({ hasUrlEventScreen });
  const decryptedAnswersObject = getDecryptedAnswersObject({
    decryptedAnswers,
    hasMigratedAnswers,
    hasUrlEventScreen,
  });

  if (shouldLogDataInDebugMode) {
    console.log(
      `[getActivityJourneyData] Created decryptedAnswersObject with ${
        Object.keys(decryptedAnswersObject).length
      } keys`,
    );
  }

  let indexForABTrailsFiles = 0;

  if (shouldLogDataInDebugMode) {
    console.log(`[getActivityJourneyData] Processing events and mapping to journey objects`);
  }

  const events = decryptedFilteredEvents.map((event, index, events) => {
    try {
      // if Activity has splash screen image (in Builder), the first event will be added as the Splash screen item
      if (
        index === 0 &&
        !decryptedAnswersObject[getEventScreen(event.screen)] &&
        events[index + 1]
      ) {
        if (shouldLogDataInDebugMode) {
          console.log(`[getActivityJourneyData] Creating splash screen for first event`);
        }

        return getSplashScreen(event, {
          ...events[index + 1],
          ...decryptedAnswersObject[getEventScreen(events[index + 1].screen)],
        });
      }

      const screenKey = getEventScreen(event.screen);

      if (shouldLogDataInDebugMode && index % 100 === 0) {
        console.log(
          `[getActivityJourneyData] Processing event ${index}/${decryptedFilteredEvents.length}, screen: ${screenKey}`,
        );
      }

      return getJourneyCSVObject({
        event: {
          ...event,
          ...decryptedAnswersObject[screenKey],
        },
        rawAnswersObject,
        index:
          event.type === UserActionType.SetAnswer ? indexForABTrailsFiles++ : indexForABTrailsFiles,
        enableDataExportRenaming: !!enableDataExportRenaming,
      });
    } catch (error) {
      console.error(`[getActivityJourneyData] Error processing event at index ${index}:`, error);
      if (error instanceof Error && shouldLogDataInDebugMode) {
        console.error(
          `[getActivityJourneyData] Error details: ${error.name}: ${error.message}, Stack: ${error.stack}`,
        );

        console.error(
          `[getActivityJourneyData] Event data: screen=${event.screen}, type=${event.type}`,
        );
      }

      return undefined;
    }
  });

  if (shouldLogDataInDebugMode) {
    console.log(
      `[getActivityJourneyData] Processed ${events.length} events, concatenating with existing data (${activityJourneyData.length} items)`,
    );
  }

  const result = activityJourneyData.concat(...events).filter(Boolean);

  if (shouldLogDataInDebugMode) {
    console.log(`[getActivityJourneyData] Final result contains ${result.length} items`);
  }

  return result;
};
