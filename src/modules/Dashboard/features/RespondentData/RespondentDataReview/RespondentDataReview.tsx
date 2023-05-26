import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { useBreadcrumbs, useHeaderSticky } from 'shared/hooks';
import { StyledContainer, StyledHeadlineLarge, StyledTitleLarge, variables } from 'shared/styles';

import { StyledTextBtn } from '../RespondentData.styles';
import { Feedback } from './Feedback';
import {
  StyledEmptyReview,
  StyledHeader,
  StyledReviewContainer,
  StyledWrapper,
} from './RespondentDataReview.styles';
import { Activity, Answer } from './RespondentDataReview.types';
import { Review } from './Review';
import { ReviewMenu } from './ReviewMenu';

export const RespondentDataReview = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  useBreadcrumbs([
    {
      icon: 'checkbox-outlined',
      label: t('review'),
    },
  ]);

  const emptyMessage = (
    <StyledEmptyReview>
      {selectedActivity?.answerDates.length === 0 ? (
        <>
          <Svg id="chart" width="67" height="67" />
          <StyledTitleLarge color={variables.palette.outline}>
            {t('noDataForActivity')}
          </StyledTitleLarge>
        </>
      ) : (
        <>
          <Svg id="data" width="60" height="73" />
          <StyledTitleLarge color={variables.palette.outline}>{t('emptyReview')}</StyledTitleLarge>
        </>
      )}
    </StyledEmptyReview>
  );

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
          <StyledWrapper>{emptyMessage}</StyledWrapper>
        )}
      </StyledReviewContainer>
      {isFeedbackOpen && <Feedback onClose={() => setIsFeedbackOpen(false)} />}
    </StyledContainer>
  );
};
