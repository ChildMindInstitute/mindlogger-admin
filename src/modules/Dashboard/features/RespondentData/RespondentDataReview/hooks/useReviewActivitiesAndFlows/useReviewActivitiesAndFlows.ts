import { useRef, useState } from 'react';
import { format } from 'date-fns';

import { useAsync } from 'shared/hooks/useAsync';
import { getReviewActivitiesApi, getReviewFlowsApi, ReviewEntity } from 'modules/Dashboard/api';
import { DateFormats } from 'shared/consts';
import { getActivityWithLatestAnswer } from 'modules/Dashboard/features/RespondentData/RespondentData.utils';

import { sortAnswerDates } from '../../utils/sortAnswerDates';
import { ReviewActivitiesAndFlowsProps } from './useReviewActivitiesAndFlows.types';

export const useReviewActivitiesAndFlows = ({
  answerId,
  submitId,
  appletId,
  shouldSetLastAnswer,
  handleSelectAnswer,
  respondentId,
}: ReviewActivitiesAndFlowsProps) => {
  const prevSelectedDateRef = useRef<null | string>(null);
  const [activities, setActivities] = useState<ReviewEntity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ReviewEntity | null>(null);
  const [flows, setFlows] = useState<ReviewEntity[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<ReviewEntity | null>(null);

  const { execute: getReviewActivities, isLoading: getActivitiesLoading } = useAsync(
    getReviewActivitiesApi,
    ({ data }) => {
      const activities = data?.result;

      if (!activities?.length) return;
      setActivities(activities);

      if ((answerId || submitId) && !shouldSetLastAnswer) return;
      const selectedActivityByDefault = getActivityWithLatestAnswer(activities) || activities[0];
      setSelectedActivity(selectedActivityByDefault);
      const { answerDates } = selectedActivityByDefault;

      if (!answerDates.length) return;
      const sortedAnswerDates = sortAnswerDates(answerDates);
      handleSelectAnswer({
        answer: { ...sortedAnswerDates[answerDates.length - 1] },
      });
    },
  );

  const { execute: getReviewFlows, isLoading: getFlowsLoading } = useAsync(
    getReviewFlowsApi,
    ({ data }) => {
      const flows = data?.result;

      if (!flows?.length) return;
      setFlows(flows);
    },
  );

  const handleGetActivitiesAndFlows = (date?: Date | null) => {
    const createdDate = date && format(date, DateFormats.YearMonthDay);

    if (!appletId || !respondentId || !createdDate || prevSelectedDateRef.current === createdDate) {
      return;
    }

    const requestBody = {
      appletId,
      targetSubjectId: respondentId,
      createdDate,
    };

    getReviewFlows(requestBody);
    getReviewActivities(requestBody);

    prevSelectedDateRef.current = createdDate;
  };

  return {
    activities,
    flows,
    handleGetActivitiesAndFlows,
    selectedActivity,
    selectedFlow,
    setSelectedActivity,
    setSelectedFlow,
    isActivitiesFlowsLoading: getActivitiesLoading || getFlowsLoading,
  };
};
