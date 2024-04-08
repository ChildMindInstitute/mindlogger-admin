import { useParams } from 'react-router-dom';
import { addDays } from 'date-fns';
import { useFormContext } from 'react-hook-form';

import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { getAnswersApi } from 'api';

import { RespondentsDataFormValues } from '../../RespondentData.types';
import { getDateISO, getFormattedResponses, getIdentifiers } from '../RespondentDataSummary.utils';
import { FetchAnswers } from '../RespondentDataSummary.types';

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
  }: FetchAnswers) => {
    if (!appletId || !respondentId) return;
    try {
      const {
        startDate,
        endDate: formEndDate,
        startTime: formStartTime,
        endTime: formEndTime,
        identifier,
        filterByIdentifier: formFilterByIdentifier,
        versions: formVersions,
        identifiers,
      } = getValues();
      const endDate = providedEndDate ?? formEndDate;
      const startTime = providedStartTime ?? formStartTime;
      const endTime = providedEndTime ?? formEndTime;
      const filterByIdentifier = providedFilterByIdentifier ?? formFilterByIdentifier;
      const versions = providedVersions ?? formVersions;

      const selectedIdentifiers = getIdentifiers(filterByIdentifier, identifier, identifiers);

      const result = await getAnswersApi({
        appletId,
        activityId: activity.id,
        params: {
          targetSubjectId: respondentId,
          fromDatetime: getDateISO(startDate, startTime),
          toDatetime: getDateISO(endDate || addDays(startDate, 1), endTime),
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
