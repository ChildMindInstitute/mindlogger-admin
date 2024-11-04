import { useEffect, useRef, useState } from 'react';
import {
  createSearchParams,
  generatePath,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { endOfMonth, format, isValid, startOfMonth } from 'date-fns';
import { Box } from '@mui/material';

import {
  getAppletSubmitDateListApi,
  AppletSubmitDateList,
  SubmitDates,
  AnswerDate,
} from 'modules/Dashboard/api';
import { ResponseWithObject } from 'shared/api';
import { DateFormats } from 'shared/consts';
import { Spinner } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { StyledContainer, theme } from 'shared/styles';
import { users } from 'redux/modules';
import { page } from 'resources';

import { Feedback } from './Feedback';
import { ActivityResponses } from './ActivityResponses';
import { ReviewMenu } from './ReviewMenu';
import { ResponsesHeader } from './ResponsesHeader';
import { RespondentDataReviewContext } from './RespondentDataReview.context';
import {
  SelectAnswerProps,
  FeedbackTabs,
  OnSelectActivityOrFlow,
} from './RespondentDataReview.types';
import { StyledReviewContainer } from './RespondentDataReview.styles';
import { RespondentsDataFormValues } from '../RespondentData.types';
import { ResponsesSummary } from './ResponsesSummary';
import { useActivityAnswersAndAssessment } from './hooks/useActivityAnswersAndAssessment/useActivityAnswersAndAssessment';
import { useReviewActivitiesAndFlows } from './hooks/useReviewActivitiesAndFlows/useReviewActivitiesAndFlows';
import { EmptyResponses } from './EmptyResponses';
import { FlowResponses } from './FlowResponses';

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

    const submitDates = datesResult.dates.map((date: string) => new Date(date));
    setResponseDates(submitDates);
  });

  const handleGetSubmitDates = (date: Date) => {
    if (!appletId || !subjectId) return;

    const fromDate = startOfMonth(date).getTime().toString();
    const toDate = endOfMonth(date).getTime().toString();

    getAppletSubmitDateList({
      appletId,
      targetSubjectId: subjectId,
      fromDate,
      toDate,
    });
  };

  const handleSetInitialDate = (date: Date) => {
    setValue('responseDate', date);
    const createdDate = format(date, DateFormats.YearMonthDay);
    handleGetActivitiesAndFlows(createdDate);
    handleGetSubmitDates(date);
  };

  const handleResponseDateChange = (date?: Date | null) => {
    const createdDate = date && format(date, DateFormats.YearMonthDay);
    // if the date hasn't changed, exit the function early
    if (!createdDate || prevSelectedDateRef.current === createdDate) {
      return;
    }
    // reset all state values to default
    setActivities([]);
    setFlows([]);
    setSelectedActivity(null);
    setSelectedFlow(null);
    setSelectedAnswer(null);
    setSearchParams(undefined);
    setActivityAnswers(null);
    setFlowAnswers(null);

    handleGetActivitiesAndFlows(createdDate);

    prevSelectedDateRef.current = createdDate;
  };

  const handleActivitySelect: OnSelectActivityOrFlow = (item) => {
    setSelectedActivity(item);
    setSelectedFlow(null);
    setFlowAnswers(null);
  };

  const handleFlowSelect: OnSelectActivityOrFlow = (item) => {
    setSelectedFlow(item);
    setSelectedActivity(null);
    setActivityAnswers(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appletId, answerId, submitId, selectedActivity, selectedFlow, selectedAnswer]);

  useEffect(() => {
    // avoid unnecessary rerender when last activity completed date state value is undefined
    if (lastActivityCompleted === undefined) return;

    const lastActivityCompletedDate = lastActivityCompleted && new Date(lastActivityCompleted);
    const selectedDateInParam =
      selectedDateParam && isValid(new Date(selectedDateParam)) && new Date(selectedDateParam);

    if (selectedDateInParam) {
      handleSetInitialDate(selectedDateInParam);

      return;
    }

    if (lastActivityCompletedDate) {
      handleSetInitialDate(lastActivityCompletedDate);

      return;
    }

    handleSetInitialDate(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastActivityCompleted]);

  const sourceSubject =
    activityAnswers?.[0]?.sourceSubject || flowAnswers?.[0]?.answers[0].sourceSubject;

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
