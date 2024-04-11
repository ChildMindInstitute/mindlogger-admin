import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useFormContext, useWatch } from 'react-hook-form';
import { endOfMonth, format, isValid, startOfMonth } from 'date-fns';

import {
  ReviewActivity,
  getActivityAnswerApi,
  getAssessmentApi,
  getReviewActivitiesApi,
  getAppletSubmitDateListApi,
  Answers,
  Response,
  AppletSubmitDateList,
  ResponseWithObject,
  SubmitDates,
  EncryptedActivityAnswer,
} from 'api';
import { DateFormats } from 'shared/consts';
import { Spinner } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { StyledContainer } from 'shared/styles';
import { DecryptedActivityData, EncryptedAnswerSharedProps } from 'shared/types';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { Item } from 'shared/state';
import { users } from 'redux/modules';

import { Feedback } from './Feedback';
import { Review } from './Review';
import { ReviewMenu } from './ReviewMenu';
import { ReviewHeader } from './ReviewHeader';
import { RespondentDataReviewContext } from './RespondentDataReview.context';
import { Answer, AssessmentActivityItem, ActivityAnswerMeta } from './RespondentDataReview.types';
import { StyledReviewContainer } from './RespondentDataReview.styles';
import { RespondentsDataFormValues } from '../RespondentData.types';
import { ReviewDescription } from './ReviewDescription';
import { useDecryptedIdentifiers } from '../RespondentDataSummary/hooks';

export const RespondentDataReview = () => {
  const { appletId, respondentId } = useParams();
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId') || '';
  const selectedDateParam = searchParams.get('selectedDate');
  const containerRef = useRef<HTMLElement | null>(null);
  const prevSelectedDateRef = useRef<null | string>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ReviewActivity | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [assessment, setAssessment] = useState<AssessmentActivityItem[]>([]);
  const [lastAssessment, setLastAssessment] = useState<Item[] | null>(null);
  const [assessmentVersions, setAssessmentVersions] = useState<string[]>([]);
  const [isLastVersion, setIsLastVersion] = useState<boolean>(false);
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [responseDates, setResponseDates] = useState<Date[]>();
  const [activities, setActivities] = useState<ReviewActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activityItemAnswers, setActivityItemAnswers] = useState<
    DecryptedActivityData<EncryptedActivityAnswer>['decryptedAnswers'] | null
  >(null);
  const [activityAnswerMeta, setActivityAnswerMeta] = useState<ActivityAnswerMeta | null>(null);
  const { lastSeen: lastActivityCompleted } = users.useRespondent()?.result || {};
  const getDecryptedIdentifiers = useDecryptedIdentifiers();

  const { control, setValue } = useFormContext<RespondentsDataFormValues>();

  const responseDate = useWatch({
    control,
    name: 'responseDate',
  });

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

  const { execute: getReviewActivities } = useAsync<Answers, Response<ReviewActivity>>(
    getReviewActivitiesApi,
    ({ data }) => {
      const activities = data?.result;
      if (!activities) return;

      setActivities(activities);

      const activity = activities.find(
        ({ id, answerDates }) => id === selectedActivity?.id && answerDates.length,
      );
      if (!activity) {
        setSelectedActivity(null);
      }
      handleSelectAnswer(null);
    },
  );

  const getDecryptedActivityData = useDecryptedActivityData();

  const { execute: getActivityAnswer } = useAsync(getActivityAnswerApi, async (res) => {
    const result = res?.data?.result;
    if (!result) return;

    const decryptedActivityData = await getDecryptedActivityData(result);
    setActivityItemAnswers(decryptedActivityData.decryptedAnswers);

    const { createdAt, identifier, version } = result;
    const decryptedIdentifiers = identifier ? await getDecryptedIdentifiers?.([identifier]) : null;
    setActivityAnswerMeta({
      createdAt,
      identifier: decryptedIdentifiers?.length ? decryptedIdentifiers[0].decryptedValue : null,
      version,
    });
  });

  const handleSelectAnswer = (answer: Answer | null) => {
    setIsFeedbackOpen(false);
    setSelectedAnswer(answer);
  };

  const handleGetSubmitDates = (date: Date) => {
    if (!appletId || !respondentId) return;

    const fromDate = startOfMonth(date).getTime().toString();
    const toDate = endOfMonth(date).getTime().toString();

    getAppletSubmitDateList({
      appletId,
      respondentId,
      fromDate,
      toDate,
    });
  };

  const handleGetActivities = (date?: Date | null) => {
    const createdDate = date && format(date, DateFormats.YearMonthDay);
    if (!appletId || !respondentId || !createdDate || prevSelectedDateRef.current === createdDate)
      return;

    getReviewActivities({
      appletId,
      respondentId,
      createdDate,
    });

    prevSelectedDateRef.current = createdDate;
  };

  const handleSetInitialDate = (date: Date) => {
    setValue('responseDate', date);
    handleGetActivities(date);
    handleGetSubmitDates(date);
  };

  useEffect(() => {
    if (!appletId || !selectedActivity || !selectedAnswer) return;
    (async () => {
      try {
        setIsLoading(true);
        await getActivityAnswer({ appletId, answerId, activityId: selectedActivity.id });
        const result = await getAssessmentApi({ appletId, answerId });
        const { reviewerPublicKey, itemsLast, versions, ...assessmentData } = result.data.result;
        const encryptedData = {
          ...assessmentData,
          userPublicKey: reviewerPublicKey,
        } as EncryptedAnswerSharedProps;
        const decryptedAssessment = await getDecryptedActivityData(encryptedData);
        setItemIds(assessmentData.itemIds || []);
        setAssessment(decryptedAssessment.decryptedAnswers as AssessmentActivityItem[]);
        setLastAssessment(itemsLast);
        setAssessmentVersions(versions);
        setIsBannerVisible(!!(itemsLast?.length && versions));
      } catch (error) {
        console.warn(error);
      } finally {
        containerRef.current?.scrollTo({
          top: 0,
        });
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appletId, answerId, selectedActivity, selectedAnswer]);

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

  return (
    <StyledContainer>
      <ReviewMenu
        control={control}
        selectedDate={responseDate}
        responseDates={responseDates}
        onMonthChange={handleGetSubmitDates}
        activities={activities}
        selectedActivity={selectedActivity}
        selectedAnswer={selectedAnswer}
        setSelectedActivity={setSelectedActivity}
        onSelectAnswer={handleSelectAnswer}
        onDateChange={handleGetActivities}
        isDatePickerLoading={getSubmitDatesLoading}
        lastActivityCompleted={lastActivityCompleted}
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
          <ReviewHeader
            containerRef={containerRef}
            isAnswerSelected={!!selectedAnswer}
            activityName={selectedActivity?.name ?? ''}
            onButtonClick={() => setIsFeedbackOpen(true)}
            data-testid={dataTestid}
          />
          {selectedAnswer && activityAnswerMeta && !isLoading && (
            <ReviewDescription {...activityAnswerMeta} data-testid={dataTestid} />
          )}
          <Review
            isLoading={isLoading}
            selectedAnswer={selectedAnswer}
            activityItemAnswers={activityItemAnswers}
            data-testid={`${dataTestid}-activity-items`}
          />
        </StyledReviewContainer>
        {selectedActivity && selectedAnswer && !isLoading && (
          <Feedback selectedActivity={selectedActivity} onClose={() => setIsFeedbackOpen(false)} />
        )}
      </RespondentDataReviewContext.Provider>
    </StyledContainer>
  );
};
