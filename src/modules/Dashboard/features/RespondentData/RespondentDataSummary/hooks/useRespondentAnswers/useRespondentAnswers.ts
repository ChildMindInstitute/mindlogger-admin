import { useParams } from 'react-router-dom';
import { addDays } from 'date-fns';
import { useFormContext } from 'react-hook-form';

import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { getAnswersApi } from 'modules/Dashboard/api';
import { RespondentsDataFormValues } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

import { getFormattedResponses } from '../../utils/getFormattedResponses';
import { FetchAnswers } from '../../RespondentDataSummary.types';
import { getDateISO, getIdentifiers } from './useRespondentAnswers.utils';
import { getOneWeekDateRange } from '../../utils/getOneWeekDateRange';

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
    versions: providedVersions,
    isFiltersChange = false,
  }: FetchAnswers) => {
    if (!appletId || !respondentId) return;
    try {
      const {
        startDate: formStartDate,
        endDate: formEndDate,
        startTime: formStartTime,
        endTime: formEndTime,
        identifier,
        filterByIdentifier: formFilterByIdentifier,
        versions: formVersions,
        identifiers,
      } = getValues();
      let endDate = providedEndDate ?? formEndDate;
      let startDate = formStartDate;
      const startTime = providedStartTime ?? formStartTime;
      const endTime = providedEndTime ?? formEndTime;
      const filterByIdentifier = providedFilterByIdentifier ?? formFilterByIdentifier;
      const versions = providedVersions ?? formVersions;

      const { selectedIdentifiers, recentAnswer } =
        getIdentifiers({
          filterByIdentifier,
          filterIdentifiers: identifier,
          identifiers,
        }) ?? {};

      recentAnswer?.startDate && setValue('startDate', recentAnswer.startDate);
      recentAnswer?.endDate && setValue('endDate', recentAnswer.endDate);

      if (isFiltersChange && (!filterByIdentifier || !identifier?.length)) {
        const { startDate: rangeStartDate, endDate: rangeEndDate } = getOneWeekDateRange(
          activity.lastAnswerDate,
        );

        if (rangeStartDate) {
          setValue('startDate', rangeStartDate);
          startDate = rangeStartDate;
        }
        if (rangeEndDate) {
          setValue('endDate', rangeEndDate);
          endDate = rangeEndDate;
        }
      }

      const fromDatetime = getDateISO(recentAnswer?.startDate || startDate, startTime);
      const toDatetime = getDateISO(
        recentAnswer?.endDate || endDate || addDays(startDate, 1),
        endTime,
      );

      const result = await getAnswersApi({
        appletId,
        activityId: activity.id,
        params: {
          respondentId,
          fromDatetime,
          toDatetime,
          emptyIdentifiers: !filterByIdentifier || !selectedIdentifiers?.length,
          identifiers: selectedIdentifiers,
          versions: versions.map(({ id }) => id),
        },
      });

      const encryptedAnswers = result.data.result;
      const decryptedAnswers = [];

      for await (const encryptedAnswer of encryptedAnswers) {
        const { userPublicKey, answer, items, itemIds, ...rest } = encryptedAnswer;
        const decryptedAnswer = (
          await getDecryptedActivityData({
            userPublicKey,
            answer,
            items,
            itemIds,
          })
        ).decryptedAnswers;

        decryptedAnswers.push({
          decryptedAnswer,
          ...rest,
        });
      }

      // TODO: remove when backend add sorting
      const sortedDecryptedAnswers = decryptedAnswers.sort((a, b) =>
        a.version.localeCompare(b.version),
      );

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
