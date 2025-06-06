import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  ActivityHistoryFull,
  getActivityAnswerApi,
  getAssessmentApi,
  getFlowAnswersApi,
  getFlowAssessmentApi,
} from 'modules/Dashboard/api';
import { useDecryptedIdentifiers } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/hooks/useDecryptedIdentifiers';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { useAsync } from 'shared/hooks/useAsync';
import { Item } from 'shared/state';
import { EncryptedAnswerSharedProps } from 'shared/types';
import { getErrorMessage } from 'shared/utils/errors';
import { getObjectFromList } from 'shared/utils/getObjectFromList';
import { sortItemsByOrder } from 'shared/utils/sortItemsByOrder';

import {
  ActivityItemAnswers,
  AssessmentActivityItem,
  FeedbackTabs,
  FlowAnswers,
  ResponsesSummary,
} from '../../RespondentDataReview.types';
import {
  ActivityAnswersAssessmentProps,
  GetAnswersAssessmentProps,
} from './useActivityAnswersAndAssessment.types';

export const useActivityAnswersAndAssessment = ({
  answerId,
  submitId,
  appletId,
  setIsFeedbackOpen,
  setActiveTab,
  containerRef,
}: ActivityAnswersAssessmentProps) => {
  const [assessment, setAssessment] = useState<AssessmentActivityItem[]>([]);
  const [lastAssessment, setLastAssessment] = useState<Item[] | null>(null);
  const [assessmentVersions, setAssessmentVersions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activityAnswers, setActivityAnswers] = useState<ActivityItemAnswers | null>(null);
  const [flowAnswers, setFlowAnswers] = useState<FlowAnswers | null>(null);
  const [responsesSummary, setResponsesSummary] = useState<ResponsesSummary | null>(null);
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const getDecryptedActivityData = useDecryptedActivityData();
  const getDecryptedIdentifiers = useDecryptedIdentifiers();
  const isFeedbackVisible = searchParams.get('isFeedbackVisible') === 'true';

  const { execute: getActivityAnswer, error: getAnswerError } = useAsync(
    getActivityAnswerApi,
    async (res) => {
      const result = res?.data?.result;
      if (!result) return;

      const decryptedActivityData = await getDecryptedActivityData({
        ...result.answer,
        items: result.activity.items,
      });

      setActivityAnswers(decryptedActivityData.decryptedAnswers);

      const { identifier } = result.summary;
      const decryptedIdentifiers = identifier
        ? await getDecryptedIdentifiers?.([identifier])
        : null;
      setResponsesSummary({
        ...result.summary,
        identifier: decryptedIdentifiers?.length ? decryptedIdentifiers[0].decryptedValue : null,
      });
    },
  );

  const { execute: getFlowAnswers, error: getFlowAnswersError } = useAsync(
    getFlowAnswersApi,
    async (res) => {
      const result = res?.data?.result;
      if (!result) return;

      const { flow, submission, summary } = result;
      const { answers, createdAt, endDatetime } = submission;

      const activitiesObject = getObjectFromList(
        flow.activities,
        (activity: ActivityHistoryFull) => activity.idVersion,
      );
      const decryptedFlowAnswers: FlowAnswers = [];

      for await (const answer of answers) {
        const { name, items } = activitiesObject[answer.activityHistoryId];
        const decryptedActivityData = await getDecryptedActivityData({
          ...answer,
          items,
        });

        decryptedFlowAnswers.push({
          activityName: name,
          answers: decryptedActivityData.decryptedAnswers,
          answerId: answer.id,
        });
      }

      setFlowAnswers(decryptedFlowAnswers);

      const { identifier, version } = summary;
      const decryptedIdentifiers = identifier
        ? await getDecryptedIdentifiers?.([identifier])
        : null;
      setResponsesSummary({
        version,
        createdAt,
        endDatetime,
        identifier: decryptedIdentifiers?.length ? decryptedIdentifiers[0].decryptedValue : null,
      });
    },
  );

  const getAnswersAndAssessment = useCallback(
    async ({ hasSelectedAnswer, activityId, flowId }: GetAnswersAssessmentProps) => {
      if (!appletId || (!activityId && !flowId) || !hasSelectedAnswer || (!answerId && !submitId)) {
        return;
      }

      try {
        setIsLoading(true);
        let assessmentResult;
        if (flowId && submitId) {
          await getFlowAnswers({ appletId, flowId, submitId });
          const response = await getFlowAssessmentApi({ appletId, submitId });
          assessmentResult = response?.data?.result;
        } else if (activityId && answerId) {
          await getActivityAnswer({ appletId, answerId, activityId });
          const response = await getAssessmentApi({ appletId, answerId });
          assessmentResult = response?.data?.result;
        }

        if (!assessmentResult) {
          return setIsLoading(false);
        }

        const { reviewerPublicKey, itemsLast, versions, items, ...assessmentData } =
          assessmentResult;
        const encryptedData = {
          ...assessmentData,
          // sorting in case the items received from the backend are in the wrong order
          items: sortItemsByOrder(items),
          userPublicKey: reviewerPublicKey,
        } as EncryptedAnswerSharedProps;
        const decryptedAssessment = await getDecryptedActivityData(encryptedData);
        setItemIds(assessmentData.itemIds || []);
        setAssessment(decryptedAssessment.decryptedAnswers as AssessmentActivityItem[]);

        // sorting in case the items received from the backend are in the wrong order
        setLastAssessment(sortItemsByOrder(itemsLast));
        setAssessmentVersions(versions);
        setIsBannerVisible(!!(itemsLast?.length && versions));

        if (decryptedAssessment?.decryptedAnswers?.length && isFeedbackVisible) {
          setIsFeedbackOpen(true);
          setActiveTab(FeedbackTabs.Reviews);
        }
      } catch (error) {
        setAssessmentError(getErrorMessage(error));
      } finally {
        containerRef.current?.scrollTo({
          top: 0,
        });
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      answerId,
      appletId,
      containerRef,
      getActivityAnswer,
      getFlowAnswers,
      isFeedbackVisible,
      setActiveTab,
      setIsFeedbackOpen,
      submitId,
    ],
  );

  const answersError = getAnswerError || getFlowAnswersError;

  const error = answersError ? getErrorMessage(answersError) : assessmentError;

  return {
    getAnswersAndAssessment,
    isLoading,
    lastAssessment,
    assessmentVersions,
    activityAnswers,
    setActivityAnswers,
    setFlowAnswers,
    flowAnswers,
    responsesSummary,
    itemIds,
    setItemIds,
    assessment,
    setAssessment,
    isBannerVisible,
    setIsBannerVisible,
    error,
  };
};
