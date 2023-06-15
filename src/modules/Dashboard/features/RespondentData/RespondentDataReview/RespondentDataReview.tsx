import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ReviewActivity, getAssessmentApi } from 'api';
import { Svg } from 'shared/components';
import { useAsync, useBreadcrumbs, useHeaderSticky } from 'shared/hooks';
import { StyledContainer, StyledHeadlineLarge, StyledTitleLarge, variables } from 'shared/styles';

import { StyledTextBtn } from '../RespondentData.styles';
import { Feedback } from './Feedback';
import {
  StyledEmptyReview,
  StyledHeader,
  StyledReviewContainer,
  StyledWrapper,
} from './RespondentDataReview.styles';
import { Answer } from './RespondentDataReview.types';
import { Review } from './Review';
import { ReviewMenu } from './ReviewMenu';

export const RespondentDataReview = () => {
  const { t } = useTranslation();
  const { appletId, answerId } = useParams();
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAssessmentVisible, setIsAssessmentVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ReviewActivity | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);

  const { execute: getAssessment } = useAsync(getAssessmentApi);

  useBreadcrumbs([
    {
      icon: 'checkbox-outlined',
      label: t('review'),
    },
  ]);

  const renderEmptyState = () => {
    if (!selectedActivity) {
      return (
        <>
          <Svg id="data" width="60" height="73" />
          <StyledTitleLarge color={variables.palette.outline}>{t('emptyReview')}</StyledTitleLarge>
        </>
      );
    }

    return (
      <>
        <Svg id="chart" width="67" height="67" />
        <StyledTitleLarge color={variables.palette.outline}>
          {t('noDataForActivity')}
        </StyledTitleLarge>
      </>
    );
  };

  useEffect(() => {
    if (!appletId || !answerId) return;
    (async () => {
      const { data } = await getAssessment({ appletId, answerId });
      setIsAssessmentVisible(!!data.result.items.length);
    })();
  }, [answerId]);

  return (
    <StyledContainer sx={{ position: 'relative' }}>
      <ReviewMenu
        selectedActivity={selectedActivity}
        selectedAnswer={selectedAnswer}
        setSelectedActivity={setSelectedActivity}
        setSelectedAnswer={setSelectedAnswer}
      />
      <StyledReviewContainer ref={containerRef}>
        <StyledHeader
          isSticky={isHeaderSticky}
          sx={{ justifyContent: selectedAnswer ? 'space-between' : 'flex-end' }}
        >
          {selectedAnswer && <StyledHeadlineLarge>{selectedActivity?.name}</StyledHeadlineLarge>}
          <StyledTextBtn
            variant="text"
            onClick={() => setIsFeedbackOpen(true)}
            disabled={!selectedAnswer}
            startIcon={<Svg id="item-outlined" width="18" height="18" />}
          >
            {t('feedback')}
          </StyledTextBtn>
        </StyledHeader>
        {selectedAnswer && selectedActivity ? (
          <Review answerId={selectedAnswer.answerId} activityId={selectedActivity.id} />
        ) : (
          <StyledWrapper>
            <StyledEmptyReview>{renderEmptyState()}</StyledEmptyReview>
          </StyledWrapper>
        )}
      </StyledReviewContainer>
      {selectedActivity && isFeedbackOpen && (
        <Feedback
          selectedActivity={selectedActivity}
          onClose={() => setIsFeedbackOpen(false)}
          isAssessmentVisible={isAssessmentVisible}
        />
      )}
    </StyledContainer>
  );
};
