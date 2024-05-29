import { useParams } from 'react-router-dom';
import { addDays } from 'date-fns';
import { useFormContext } from 'react-hook-form';

import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import {
  ActivityHistoryFull,
  EncryptedActivityAnswers,
  getActivityAnswersApi,
  getSummaryFlowAnswersApi,
} from 'modules/Dashboard/api';
import {
  ActivityCompletion,
  FlowSubmission,
  FlowActivityAnswers,
  RespondentsDataFormValues,
  FlowResponses,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';
import { getObjectFromList } from 'shared/utils/getObjectFromList';

import { getFormattedResponses } from '../../utils/getFormattedResponses';
import { FetchAnswers } from '../../RespondentDataSummary.types';
import { getDateISO, getIdentifiers, processIdentifiersChange } from './useRespondentAnswers.utils';

export const useRespondentAnswers = () => {
  const { appletId, respondentId } = useParams();
  const getDecryptedActivityData = useDecryptedActivityData();
  const { getValues, setValue } = useFormContext<RespondentsDataFormValues>();

  const getActivityDecryptedAnswers = async (encryptedAnswers: EncryptedActivityAnswers[]) => {
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

    return decryptedAnswers
      .reduce((acc: ActivityCompletion[], result) => {
        if (result.status === 'fulfilled') {
          acc.push(result.value);
        }

        return acc;
      }, [])
      .sort((a, b) => a.version.localeCompare(b.version));
  };

  const fetchAnswers = async ({
    entity,
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

      const { identifierAnswerStartDate, identifierAnswerEndDate, answerStartDate, answerEndDate } =
        processIdentifiersChange({
          setValue,
          isIdentifiersChange,
          adjustStartEndDates: !!(filterByIdentifier && identifier?.length),
          recentIdentifiersAnswerDate: recentAnswerDateString,
          lastAnswerDate: entity.lastAnswerDate,
        }) ?? {};

      /*The start date for filters is computed based on the following criteria:
      1. If identifiers are selected, it's set to one week before the latest answer containing the chosen identifier(s).
      2. If identifiers were previously selected and then deselected, it's set to one week before the latest activity answer.*/
      const startDate = identifierAnswerStartDate ?? answerStartDate ?? formStartDate;
      /*The end date for filters is computed based on the following criteria:
        1. If identifiers are selected, it's set to the latest answer containing the chosen identifier(s).
        2. If identifiers were previously selected and then deselected, it's set to the latest activity answer.
        3. If no changes were made to the identifiers, it's set to the provided date (if available) or the date from the form.*/
      const endDate =
        identifierAnswerEndDate ??
        answerEndDate ??
        providedEndDate ??
        formEndDate ??
        addDays(startDate, 1);
      const fromDatetime = getDateISO(startDate, startTime);
      const toDatetime = getDateISO(endDate, endTime);

      const params = {
        respondentId,
        fromDatetime,
        toDatetime,
        emptyIdentifiers: !filterByIdentifier,
        identifiers: selectedIdentifiers,
        versions: versions.map(({ id }) => id),
      };

      if (entity.isFlow) {
        const {
          data: { result: encryptedFlowSubmissions },
        } = await getSummaryFlowAnswersApi({
          appletId,
          flowId: entity.id,
          params,
        });

        const flowSubmissions: FlowSubmission[] = [];
        const activityAnswersMap: Map<string, FlowActivityAnswers> = new Map();

        for await (const {
          flowHistoryId,
          answers,
          submitId,
          endDatetime,
          createdAt,
          reviewCount,
        } of encryptedFlowSubmissions.submissions) {
          const currentFlow = encryptedFlowSubmissions.flows.find(
            (flow) => flow.idVersion === flowHistoryId,
          );
          if (!currentFlow) return;
          const activitiesObject = getObjectFromList(
            currentFlow.activities,
            (activity: ActivityHistoryFull) => activity.idVersion,
          );

          for await (const answer of answers) {
            const { name, items, subscaleSetting, id, performanceTaskType } =
              activitiesObject[answer.activityHistoryId];
            const decryptedAnswers = await getActivityDecryptedAnswers([
              {
                ...answer,
                items,
                answerId: answer.id,
                events: answer.events ?? '',
                subscaleSetting,
              },
            ]);

            const existingAnswer = activityAnswersMap.get(id);
            if (existingAnswer) {
              existingAnswer.answers.push(...decryptedAnswers);
            } else {
              activityAnswersMap.set(id, {
                activityId: id,
                activityName: name,
                isPerformanceTask: !!performanceTaskType,
                answers: decryptedAnswers,
              });
            }
          }

          flowSubmissions.push({
            submitId,
            endDatetime,
            createdAt,
            reviewCount,
          });
        }

        const flowResponses: FlowResponses[] = Array.from(activityAnswersMap.values()).map(
          (item) => {
            const { subscalesFrequency, formattedResponses } = getFormattedResponses(item.answers);

            return {
              ...item,
              subscalesFrequency,
              responseOptions: formattedResponses,
            };
          },
        );

        setValue('flowSubmissions', flowSubmissions);
        setValue('flowResponses', flowResponses);

        return;
      }

      const {
        data: { result: encryptedAnswers },
      } = await getActivityAnswersApi({
        appletId,
        activityId: entity.id,
        params,
      });

      const decryptedAnswers = await getActivityDecryptedAnswers(encryptedAnswers);
      setValue('answers', decryptedAnswers);

      const { subscalesFrequency, formattedResponses } = getFormattedResponses(decryptedAnswers);
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
