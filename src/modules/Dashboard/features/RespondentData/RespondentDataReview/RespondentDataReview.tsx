import { Box } from '@mui/material';
import { endOfMonth, format, isValid, startOfMonth } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  createSearchParams,
  generatePath,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import {
  AnswerDate,
  AppletSubmitDateList,
  getAppletSubmitDateListApi,
  SubmitDates,
} from 'modules/Dashboard/api';
import { users } from 'redux/modules';
import { page } from 'resources';
import { ResponseWithObject } from 'shared/api';
import { Spinner } from 'shared/components';
import { DateFormats } from 'shared/consts';
import { useAsync } from 'shared/hooks';
import { StyledContainer, theme } from 'shared/styles';
import { parseDateToMidnightLocal } from 'shared/utils';

import { RespondentsDataFormValues } from '../RespondentData.types';
import { ActivityResponses } from './ActivityResponses';
import { EmptyResponses } from './EmptyResponses';
import { Feedback } from './Feedback';
import { FlowResponses } from './FlowResponses';
import { RespondentDataReviewContext } from './RespondentDataReview.context';
import { StyledReviewContainer } from './RespondentDataReview.styles';
import {
  FeedbackTabs,
  OnSelectActivityOrFlow,
  SelectAnswerProps,
} from './RespondentDataReview.types';
import { ResponsesHeader } from './ResponsesHeader';
import { ResponsesSummary } from './ResponsesSummary';
import { ReviewMenu } from './ReviewMenu';
import { useActivityAnswersAndAssessment } from './hooks/useActivityAnswersAndAssessment/useActivityAnswersAndAssessment';
import { useReviewActivitiesAndFlows } from './hooks/useReviewActivitiesAndFlows/useReviewActivitiesAndFlows';

export const RespondentDataReview = () => {
  const { appletId, subjectId, activityId, activityFlowId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const answerId = searchParams.get('answerId') || null;
  const submitId = searchParams.get('submitId') || null;
  const selectedDateParam = searchParams.get('selectedDate');
  const containerRef = useRef<HTMLElement | null>(null);
  const prevSelectedDateRef = useRef<null | string>(null);

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(FeedbackTabs.Notes);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerDate | null>(null);
  const [isLastVersion, setIsLastVersion] = useState<boolean>(false);
  const [responseDates, setResponseDates] = useState<Date[]>();

  const handleSelectAnswer = ({ answer, isRouteCreated }: SelectAnswerProps) => {
    setIsFeedbackOpen(false);
    setSelectedAnswer(answer);

    if (isRouteCreated) return;

    const responseDate = getValues('responseDate');
    if (!responseDate || !answer) return;

    let route: string;
    if (activityId) route = page.appletParticipantActivityDetailsDataReview;
    else if (activityFlowId) route = page.appletParticipantActivityDetailsFlowDataReview;
    else route = page.appletParticipantDataReview;

    const pathname = generatePath(route, { appletId, subjectId, activityId, activityFlowId });

    navigate({
      pathname,
      search: createSearchParams({
        selectedDate: format(responseDate, DateFormats.YearMonthDay),
        ...(answer.answerId && { answerId: answer.answerId }),
        ...(answer.submitId && { submitId: answer.submitId }),
      }).toString(),
    });
  };

  const {
    activities,
    flows,
    setActivities,
    setFlows,
    handleGetActivitiesAndFlows,
    selectedActivity,
    selectedFlow,
    isActivitiesFlowsLoading,
    setSelectedActivity,
    setSelectedFlow,
  } = useReviewActivitiesAndFlows({
    answerId,
    submitId,
    activityId,
    activityFlowId,
    appletId,
    subjectId,
    handleSelectAnswer,
  });

  const {
    getAnswersAndAssessment,
    isLoading,
    lastAssessment,
    assessmentVersions,
    activityAnswers,
    setActivityAnswers,
    flowAnswers,
    setFlowAnswers,
    responsesSummary,
    itemIds,
    setItemIds,
    assessment,
    setAssessment,
    isBannerVisible,
    setIsBannerVisible,
    error,
  } = useActivityAnswersAndAssessment({
    answerId,
    submitId,
    appletId,
    setIsFeedbackOpen,
    setActiveTab,
    containerRef,
  });

  const { lastSeen: lastActivityCompleted } = users.useSubject()?.result || {};
  const navigate = useNavigate();
  const { control, setValue, getValues } = useFormContext<RespondentsDataFormValues>();

  const dataTestid = 'respondents-review';

  const { execute: getAppletSubmitDateList, isLoading: getSubmitDatesLoading } = useAsync<
    AppletSubmitDateList,
    ResponseWithObject<SubmitDates>
  >(getAppletSubmitDateListApi, ({ data }) => {
    const datesResult = data?.result;
    if (!datesResult) return;

    const submitDates = datesResult.dates.map(parseDateToMidnightLocal);
    setResponseDates(submitDates);
  });

  const handleGetSubmitDates = useCallback(
    (date: Date) => {
      const activityOrFlowId = activityFlowId || activityId;
      // TODO: Add !activityOrFlowId to the if statement after dataviz tests have been updated
      // https://mindlogger.atlassian.net/browse/M2-8891
      if (!appletId || !subjectId) return;

      const fromDate = startOfMonth(date).getTime().toString();
      const toDate = endOfMonth(date).getTime().toString();

      getAppletSubmitDateList({
        appletId,
        targetSubjectId: subjectId,
        fromDate,
        toDate,
        activityOrFlowId,
      });
    },
    [appletId, subjectId, activityFlowId, activityId, getAppletSubmitDateList],
  );

  const handleSetInitialDate = useCallback(
    (date: Date) => {
      setValue('responseDate', date);
      const createdDate = format(date, DateFormats.YearMonthDay);
      handleGetActivitiesAndFlows(createdDate);
      prevSelectedDateRef.current = createdDate;
    },
    [setValue, handleGetActivitiesAndFlows],
  );

  const handleResponseDateChange = (date?: Date | null) => {
    const createdDate = date && format(date, DateFormats.YearMonthDay);
    // if the date hasn't changed, exit the function early
    if (!createdDate || selectedDateParam === createdDate) {
      return;
    }

    // reset all state values to default
    setActivities([]);
    setFlows([]);
    setSelectedActivity(null);
    setSelectedFlow(null);
    setSelectedAnswer(null);
    setSearchParams(() => ({
      selectedDate: createdDate,
    }));
    setActivityAnswers(null);
    setFlowAnswers(null);

    prevSelectedDateRef.current = createdDate;
    handleGetActivitiesAndFlows(createdDate);
  };

  const handleActivitySelect: OnSelectActivityOrFlow = (item) => {
    setSelectedActivity(item);
    setSelectedFlow(null);
  };

  const handleFlowSelect: OnSelectActivityOrFlow = (item) => {
    setSelectedFlow(item);
    setSelectedActivity(null);
  };

  const hasAnswers = !!activityAnswers || !!flowAnswers;
  const isAnswerSelected = !!selectedAnswer;
  const isActivityOrFlowSelected = !!selectedActivity || !!selectedFlow;
  const isAnswerSelectedAndNoError = isAnswerSelected && !error;
  const hasActivityResponses =
    selectedActivity &&
    activityAnswers &&
    !selectedFlow &&
    !flowAnswers &&
    isAnswerSelectedAndNoError;
  const hasFlowResponses =
    selectedFlow &&
    flowAnswers &&
    !selectedActivity &&
    !activityAnswers &&
    isAnswerSelectedAndNoError;

  useEffect(() => {
    getAnswersAndAssessment({
      hasSelectedAnswer: !!selectedAnswer,
      activityId: selectedActivity?.id,
      flowId: selectedFlow?.id,
    });
  }, [
    appletId,
    answerId,
    submitId,
    selectedActivity,
    selectedFlow,
    selectedAnswer,
    getAnswersAndAssessment,
  ]);

  // Effect to get submit dates
  useEffect(() => {
    if (lastActivityCompleted === undefined) return;

    let initialDate: Date;
    if (selectedDateParam) {
      const parsedDate = parseDateToMidnightLocal(selectedDateParam);
      initialDate = isValid(parsedDate) ? parsedDate : new Date();
    } else if (lastActivityCompleted) {
      initialDate = new Date(lastActivityCompleted);
    } else {
      initialDate = new Date();
    }

    handleGetSubmitDates(initialDate);
  }, [lastActivityCompleted, selectedDateParam, handleGetSubmitDates]);

  // Effect to point current view to either selected date or last submit date after response dates are loaded
  useEffect(() => {
    if (!responseDates?.length) return;

    if (!selectedDateParam) {
      handleSetInitialDate(responseDates[responseDates.length - 1]);

      return;
    }

    const selectedDate = parseDateToMidnightLocal(selectedDateParam);
    if (
      prevSelectedDateRef.current !== selectedDateParam &&
      responseDates.some((date) => date.getTime() === selectedDate.getTime())
    ) {
      handleSetInitialDate(selectedDate);
    }
  }, [responseDates, selectedDateParam, handleSetInitialDate]);

  /**
   * Determines the source subject based on the presence of activity responses.
   * If activity responses are available, it retrieves the source subject from the first activity answer.
   * Otherwise, it retrieves the source subject from the first flow answer.
   */
  const sourceSubject = hasActivityResponses
    ? activityAnswers?.[0]?.sourceSubject
    : flowAnswers?.[0]?.answers[0].sourceSubject;

  return (
    <StyledContainer>
      <ReviewMenu
        control={control}
        responseDates={responseDates}
        onMonthChange={handleGetSubmitDates}
        activities={activities}
        flows={flows}
        selectedActivityId={selectedActivity?.id}
        selectedFlowId={selectedFlow?.id}
        onSelectActivity={handleActivitySelect}
        onSelectFlow={handleFlowSelect}
        selectedAnswer={selectedAnswer}
        onSelectAnswer={handleSelectAnswer}
        onDateChange={handleResponseDateChange}
        isDatePickerLoading={getSubmitDatesLoading}
        lastActivityCompleted={lastActivityCompleted}
        isActivitiesFlowsLoading={isActivitiesFlowsLoading}
      />
      <RespondentDataReviewContext.Provider
        value={{
          isFeedbackOpen,
          assessment,
          setAssessment,
          lastAssessment,
          assessmentVersions,
          isLastVersion,
          setIsLastVersion,
          isBannerVisible,
          setIsBannerVisible,
          itemIds,
          setItemIds,
        }}
      >
        <StyledReviewContainer ref={containerRef} data-testid={`${dataTestid}-container`}>
          {isLoading && <Spinner />}
          <ResponsesHeader
            containerRef={containerRef}
            isAnswerSelected={!!selectedAnswer}
            name={selectedActivity?.name ?? selectedFlow?.name ?? ''}
            onButtonClick={() => setIsFeedbackOpen(true)}
            data-testid={dataTestid}
          />
          {!isLoading && (
            <>
              {selectedAnswer && responsesSummary && !error && (
                <ResponsesSummary
                  {...responsesSummary}
                  sourceSubject={sourceSubject}
                  data-testid={dataTestid}
                />
              )}
              <EmptyResponses
                hasAnswers={hasAnswers}
                isAnswerSelected={isAnswerSelected}
                isActivityOrFlowSelected={isActivityOrFlowSelected}
                error={error}
                data-testid={`${dataTestid}-empty-review`}
              />
              {hasActivityResponses && (
                <Box sx={{ m: theme.spacing(0, 6) }}>
                  <ActivityResponses
                    activityAnswers={activityAnswers}
                    data-testid={`${dataTestid}-activity-answers`}
                  />
                </Box>
              )}
              {hasFlowResponses && (
                <FlowResponses
                  flowAnswers={flowAnswers}
                  data-testid={`${dataTestid}-flow-answers`}
                />
              )}
            </>
          )}
        </StyledReviewContainer>
        {isActivityOrFlowSelected && selectedAnswer && !isLoading && (
          <Feedback
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedEntity={{
              id: selectedActivity?.id || selectedFlow?.id || '',
              isFlow: !!selectedFlow,
            }}
            onClose={() => setIsFeedbackOpen(false)}
          />
        )}
      </RespondentDataReviewContext.Provider>
    </StyledContainer>
  );
};
