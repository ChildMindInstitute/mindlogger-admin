import { useParams } from 'react-router-dom';
import { addDays } from 'date-fns';
import { useFormContext } from 'react-hook-form';

import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { getAnswersApi } from 'modules/Dashboard/api';
import {
  ActivityCompletion,
  RespondentsDataFormValues,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

import { getFormattedResponses } from '../../utils/getFormattedResponses';
import { FetchAnswers } from '../../RespondentDataSummary.types';
import { getDateISO, getIdentifiers, processIdentifiersChange } from './useRespondentAnswers.utils';

export const useRespondentAnswers = () => {
  const { appletId, respondentId } = useParams();
  const getDecryptedActivityData = useDecryptedActivityData();
  const { getValues, setValue } = useFormContext<RespondentsDataFormValues>();

  const fetchAnswers = async ({
    activity,
    endDate: providedEndDate,
    startTime: providedStartTime,
    endTime: providedEndTime,
    filterByIdentifier: providedFilterByIdentifier,
    identifier: providedIdentifier,
    versions: providedVersions,
    isIdentifiersChange = false,
  }: FetchAnswers) => {
    if (!appletId || !respondentId) return;

    try {
      const {
        startDate: formStartDate,
        endDate: formEndDate,
        startTime: formStartTime,
        endTime: formEndTime,
        identifier: formIdentifier,
        filterByIdentifier: formFilterByIdentifier,
        versions: formVersions,
        identifiers,
      } = getValues();
      const startTime = providedStartTime ?? formStartTime;
      const endTime = providedEndTime ?? formEndTime;
      const filterByIdentifier = providedFilterByIdentifier ?? formFilterByIdentifier;
      const versions = providedVersions ?? formVersions;
      const identifier = providedIdentifier ?? formIdentifier;

      const { selectedIdentifiers, recentAnswerDateString } =
        getIdentifiers({
          filterByIdentifier,
          filterIdentifiers: identifier,
          identifiers,
        }) ?? {};

      const {
        identifierAnswerStartDate,
        identifierAnswerEndDate,
        activityAnswerStartDate,
        activityAnswerEndDate,
      } =
        processIdentifiersChange({
          setValue,
          isIdentifiersChange,
          adjustStartEndDates: !!(filterByIdentifier && identifier?.length),
          recentIdentifiersAnswerDate: recentAnswerDateString,
          activityLastAnswerDate: activity.lastAnswerDate,
        }) ?? {};

      /*The start date for filters is computed based on the following criteria:
      1. If identifiers are selected, it's set to one week before the latest answer containing the chosen identifier(s).
      2. If identifiers were previously selected and then deselected, it's set to one week before the latest activity answer.*/
      const startDate = identifierAnswerStartDate ?? activityAnswerStartDate ?? formStartDate;
      /*The end date for filters is computed based on the following criteria:
        1. If identifiers are selected, it's set to the latest answer containing the chosen identifier(s).
        2. If identifiers were previously selected and then deselected, it's set to the latest activity answer.
        3. If no changes were made to the identifiers, it's set to the provided date (if available) or the date from the form.*/
      const endDate =
        identifierAnswerEndDate ??
        activityAnswerEndDate ??
        providedEndDate ??
        formEndDate ??
        addDays(startDate, 1);
      const fromDatetime = getDateISO(startDate, startTime);
      const toDatetime = getDateISO(endDate, endTime);

      const {
        data: { result: encryptedAnswers },
      } = await getAnswersApi({
        appletId,
        activityId: activity.id,
        params: {
          targetSubjectId: respondentId,
          fromDatetime,
          toDatetime,
          emptyIdentifiers: !filterByIdentifier || !selectedIdentifiers?.length,
          identifiers: selectedIdentifiers,
          versions: versions.map(({ id }) => id),
        },
      });

      const decryptedAnswers = await Promise.allSettled(
        encryptedAnswers.map(async (encryptedAnswer) => {
          const { userPublicKey, answer, items, itemIds, ...rest } = encryptedAnswer;
          const { decryptedAnswers } = await getDecryptedActivityData({
            userPublicKey,
            answer,
            items,
            itemIds,
          });

          return {
            decryptedAnswer: decryptedAnswers,
            ...rest,
          };
        }),
      );

      const sortedDecryptedAnswers = decryptedAnswers
        .reduce((acc: ActivityCompletion[], result) => {
          if (result.status === 'fulfilled') {
            acc.push(result.value);
          }

          return acc;
        }, [])
        .sort((a, b) => a.version.localeCompare(b.version));

      setValue('answers', sortedDecryptedAnswers);
      const { subscalesFrequency, formattedResponses } =
        getFormattedResponses(sortedDecryptedAnswers);

      setValue('responseOptions', formattedResponses);
      setValue('subscalesFrequency', subscalesFrequency);
    } catch (error) {
      console.warn(error);
    }
  };

  return {
    fetchAnswers,
  };
};
