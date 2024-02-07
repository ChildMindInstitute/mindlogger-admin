import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
} from 'api';
import { DateFormats } from 'shared/consts';
import { Svg, Spinner } from 'shared/components';
import { useAsync, useHeaderSticky } from 'shared/hooks';
import { StyledContainer, StyledStickyHeader, StyledStickyHeadline } from 'shared/styles';
import { DecryptedActivityData, EncryptedAnswerSharedProps } from 'shared/types';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { Item } from 'shared/state';

import { StyledTextBtn } from '../RespondentData.styles';
import { StyledContentContainer, StyledReviewContainer } from './RespondentDataReview.styles';
import { Answer, AssessmentActivityItem } from './RespondentDataReview.types';
import { Feedback } from './Feedback';
import { Review } from './Review';
import { ReviewMenu } from './ReviewMenu';
import { RespondentDataReviewContext } from './RespondentDataReview.context';

export const RespondentDataReview = () => {
  const { t } = useTranslation();
  const { appletId, respondentId } = useParams();
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId') || '';
  const selectedDateParam = searchParams.get('selectedDate');
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
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
    DecryptedActivityData<EncryptedAnswerSharedProps>['decryptedAnswers'] | null
  >(null);

  const { control } = useForm({
    defaultValues: {
      date:
        selectedDateParam && isValid(new Date(selectedDateParam!))
          ? new Date(selectedDateParam!)
          : new Date(),
    },
  });

  const date = useWatch({
    control,
    name: 'date',
  });

  const dataTestid = 'respondents-review';

  const { execute: getAppletSubmitDateList } = useAsync<
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
    if (!res?.data?.result) return;

    const decryptedActivityData = await getDecryptedActivityData(res.data.result);
    setActivityItemAnswers(decryptedActivityData.decryptedAnswers);
  });

  const handleSelectAnswer = (answer: Answer | null) => {
    setIsFeedbackOpen(false);
    setSelectedAnswer(answer);
  };

  const handleMonthChange = (date: Date) => {
    if (!appletId || !respondentId) return;

    const fromDate = startOfMonth(date).getTime().toString();
    const toDate = endOfMonth(date).getTime().toString();

    getAppletSubmitDateList({
      appletId,
      targetSubjectId: respondentId,
      fromDate,
      toDate,
    });
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
  }, [appletId, answerId, selectedActivity, selectedAnswer]);

  useEffect(() => {
    if (appletId && respondentId && date) {
      getReviewActivities({
        appletId,
        targetSubjectId: respondentId,
        createdDate: format(date || new Date(), DateFormats.YearMonthDay),
      });
    }
  }, [date]);

  useEffect(() => {
    handleMonthChange(date || new Date());
  }, []);

  return (
    <StyledContainer>
      <ReviewMenu
        control={control}
        selectedDate={date}
        responseDates={responseDates}
        onMonthChange={handleMonthChange}
        activities={activities}
        selectedActivity={selectedActivity}
        selectedAnswer={selectedAnswer}
        setSelectedActivity={setSelectedActivity}
        onSelectAnswer={handleSelectAnswer}
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
        <StyledContentContainer>
          {isLoading && <Spinner />}
          <StyledReviewContainer ref={containerRef} data-testid={`${dataTestid}-container`}>
            <StyledStickyHeader
              isSticky={isHeaderSticky}
              sx={{ justifyContent: selectedAnswer ? 'space-between' : 'flex-end' }}
            >
              {selectedAnswer && (
                <StyledStickyHeadline isSticky={isHeaderSticky}>
                  {selectedActivity?.name}
                </StyledStickyHeadline>
              )}
              <StyledTextBtn
                variant="text"
                onClick={() => setIsFeedbackOpen(true)}
                disabled={!selectedAnswer}
                startIcon={<Svg id="item-outlined" width="18" height="18" />}
                data-testid={`${dataTestid}-feedback-button`}
              >
                {t('feedback')}
              </StyledTextBtn>
            </StyledStickyHeader>
            <Review
              isLoading={isLoading}
              selectedAnswer={selectedAnswer}
              activityItemAnswers={activityItemAnswers}
              data-testid={`${dataTestid}-activity-items`}
            />
          </StyledReviewContainer>
        </StyledContentContainer>
        {selectedActivity && selectedAnswer && !isLoading && (
          <Feedback selectedActivity={selectedActivity} onClose={() => setIsFeedbackOpen(false)} />
        )}
      </RespondentDataReviewContext.Provider>
    </StyledContainer>
  );
};
