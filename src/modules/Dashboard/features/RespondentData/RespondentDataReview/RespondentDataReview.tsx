import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ReviewActivity, getAssessmentApi } from 'api';
import { Svg } from 'shared/components/Svg';
import { useAsync, useHeaderSticky } from 'shared/hooks';
import {
  StyledContainer,
  StyledStickyHeader,
  StyledStickyHeadline,
  StyledTitleLarge,
  theme,
  variables,
} from 'shared/styles';
import { EncryptedAnswerSharedProps } from 'shared/types';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

import { StyledTextBtn } from '../RespondentData.styles';
import {
  StyledEmptyReview,
  StyledReviewContainer,
  StyledWrapper,
} from './RespondentDataReview.styles';
import { Answer, AssessmentActivityItem } from './RespondentDataReview.types';
import { Feedback } from './Feedback';
import { Review } from './Review';
import { ReviewMenu } from './ReviewMenu';
import { RespondentDataReviewContext } from './RespondentDataReview.context';

export const RespondentDataReview = () => {
  const { t } = useTranslation();
  const { appletId } = useParams();
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId');
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ReviewActivity | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [assessment, setAssessment] = useState<AssessmentActivityItem[]>([]);
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dataTestid = 'respondents-review';

  const getDecryptedActivityData = useDecryptedActivityData();
  const { execute: getAssessment } = useAsync(getAssessmentApi);

  const handleSelectAnswer = (answer: Answer | null) => {
    setIsFeedbackOpen(false);
    setSelectedAnswer(answer);
  };

  const renderEmptyState = () => {
    if (!selectedAnswer) {
      return (
        <>
          <Svg id="data" width="80" height="80" />
          <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
            {t('emptyReview')}
          </StyledTitleLarge>
        </>
      );
    }

    return (
      <>
        <Svg id="chart" width="67" height="67" />
        <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
          {t('noDataForActivity')}
        </StyledTitleLarge>
      </>
    );
  };

  useEffect(() => {
    if (!appletId || !answerId) return;
    (async () => {
      try {
        setIsLoading(true);
        const result = await getAssessment({ appletId, answerId });
        const { reviewerPublicKey, ...assessmentData } = result.data.result;
        const encryptedData = {
          ...assessmentData,
          userPublicKey: reviewerPublicKey,
        } as EncryptedAnswerSharedProps;
        const decryptedAssessment = getDecryptedActivityData(encryptedData);
        setItemIds(result.data.result.itemIds || []);
        setAssessment(decryptedAssessment.decryptedAnswers as AssessmentActivityItem[]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [appletId, answerId]);

  return (
    <StyledContainer sx={{ position: 'relative' }}>
      <ReviewMenu
        selectedActivity={selectedActivity}
        selectedAnswer={selectedAnswer}
        setSelectedActivity={setSelectedActivity}
        onSelectAnswer={handleSelectAnswer}
      />
      <RespondentDataReviewContext.Provider
        value={{ isFeedbackOpen, assessment, itemIds, setItemIds }}
      >
        <StyledReviewContainer ref={containerRef} data-testid={`${dataTestid}-activity-items`}>
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
              data-testid={`${dataTestid}-feedback`}
            >
              {t('feedback')}
            </StyledTextBtn>
          </StyledStickyHeader>
          {selectedActivity && selectedAnswer ? (
            <Review
              answerId={selectedAnswer.answerId}
              activityId={selectedActivity.id}
              data-testid={`${dataTestid}-activity-items`}
            />
          ) : (
            <StyledWrapper>
              <StyledEmptyReview>{renderEmptyState()}</StyledEmptyReview>
            </StyledWrapper>
          )}
        </StyledReviewContainer>
        {selectedActivity && selectedAnswer && !isLoading && (
          <Feedback selectedActivity={selectedActivity} onClose={() => setIsFeedbackOpen(false)} />
        )}
      </RespondentDataReviewContext.Provider>
    </StyledContainer>
  );
};
