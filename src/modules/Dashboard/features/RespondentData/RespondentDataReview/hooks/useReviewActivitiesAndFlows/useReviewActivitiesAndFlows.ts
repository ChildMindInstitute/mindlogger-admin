import { useCallback, useEffect, useState } from 'react';

import { getReviewActivitiesApi, getReviewFlowsApi, ReviewEntity } from 'modules/Dashboard/api';
import {
  getConcatenatedEntities,
  getEntityWithLatestAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentData.utils';
import { useAsync } from 'shared/hooks/useAsync';

import { sortAnswerDates } from '../../utils/sortAnswerDates';
import { ReviewActivitiesAndFlowsProps } from './useReviewActivitiesAndFlows.types';

export const useReviewActivitiesAndFlows = ({
  answerId,
  submitId,
  appletId,
  activityId,
  activityFlowId,
  handleSelectAnswer,
  subjectId,
}: ReviewActivitiesAndFlowsProps) => {
  const [activities, setActivities] = useState<ReviewEntity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ReviewEntity | null>(null);
  const [flows, setFlows] = useState<ReviewEntity[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<ReviewEntity | null>(null);

  const { execute: getReviewActivities, isLoading: getActivitiesLoading } = useAsync(
    getReviewActivitiesApi,
    ({ data }) => {
      const activities = data?.result;

      if (!activities?.length) return;
      let selectedActivityByDefault;
      if (activityId) {
        selectedActivityByDefault = activities.filter((e) => e.id === activityId)[0];
        setActivities([selectedActivityByDefault]);
      } else if (!activityFlowId) {
        setActivities(activities);
      }
    },
  );

  const { execute: getReviewFlows, isLoading: getFlowsLoading } = useAsync(
    getReviewFlowsApi,
    ({ data }) => {
      const flows = data?.result;

      if (!flows?.length) return;
      let selectedActivityFlowByDefault;
      if (activityFlowId) {
        selectedActivityFlowByDefault = flows.filter((e) => e.id === activityFlowId)[0];
        setFlows([selectedActivityFlowByDefault]);
      } else if (!activityId) {
        setFlows(flows);
      }
    },
  );

  const handleGetActivitiesAndFlows = useCallback(
    (createdDate: string) => {
      if (!appletId || !subjectId) {
        return;
      }

      const requestBody = {
        appletId,
        targetSubjectId: subjectId,
        createdDate,
      };

      getReviewFlows(requestBody);
      getReviewActivities(requestBody);
    },
    [appletId, subjectId, getReviewActivities, getReviewFlows],
  );

  useEffect(() => {
    if (
      answerId ||
      submitId ||
      selectedActivity ||
      selectedFlow ||
      (activityId && !activities.length) ||
      (activityFlowId && !flows.length) ||
      (!activities.length && !flows.length) ||
      !handleSelectAnswer
    ) {
      return;
    }

    let selectedEntityByDefault;
    if (activityId) {
      selectedEntityByDefault = activities.filter((e) => e.id === activityId)[0];
      setSelectedActivity(selectedEntityByDefault);
    } else if (activityFlowId) {
      selectedEntityByDefault = flows.filter((e) => e.id === activityFlowId)[0];
      setSelectedFlow(selectedEntityByDefault);
    } else {
      // This only supports the legacy access through the /dataviz endpoint

      const reviewEntitiesWithAnswers = getConcatenatedEntities({ activities, flows }).filter(
        (entity) => entity.answerDates?.length > 0,
      );

      if (reviewEntitiesWithAnswers.length === 0) {
        return;
      }

      selectedEntityByDefault =
        getEntityWithLatestAnswer(reviewEntitiesWithAnswers) || reviewEntitiesWithAnswers[0];

      selectedEntityByDefault.isFlow
        ? setSelectedFlow(selectedEntityByDefault)
        : setSelectedActivity(selectedEntityByDefault);
    }

    const { answerDates } = selectedEntityByDefault;

    if (!answerDates.length) return;

    const sortedAnswerDates = sortAnswerDates(answerDates);
    handleSelectAnswer({
      answer: { ...sortedAnswerDates[answerDates.length - 1] },
    });
  }, [
    answerId,
    activityId,
    submitId,
    activities,
    flows,
    handleSelectAnswer,
    selectedFlow,
    selectedActivity,
    activityFlowId,
  ]);

  return {
    activities,
    setActivities,
    flows,
    setFlows,
    handleGetActivitiesAndFlows,
    selectedActivity,
    selectedFlow,
    setSelectedActivity,
    setSelectedFlow,
    isActivitiesFlowsLoading: getActivitiesLoading || getFlowsLoading,
  };
};
