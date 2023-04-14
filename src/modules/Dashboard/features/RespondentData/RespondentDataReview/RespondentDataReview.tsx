import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { useHeaderSticky } from 'shared/hooks';
import { StyledContainer, StyledHeadlineLarge } from 'shared/styles';

import { StyledTextBtn } from '../RespondentData.styles';
import { Feedback } from './Feedback';
import { StyledHeader, StyledReviewContainer } from './RespondentDataReview.styles';
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
        <Review answerId={selectedAnswer?.answerId ?? null} />
      </StyledReviewContainer>
      {isFeedbackOpen && <Feedback onClose={() => setIsFeedbackOpen(false)} />}
    </StyledContainer>
  );
};
