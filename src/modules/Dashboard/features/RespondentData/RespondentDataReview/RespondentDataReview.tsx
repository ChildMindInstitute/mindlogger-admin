import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Activity } from 'redux/modules';
import { Svg } from 'shared/components';
import { useHeaderSticky } from 'shared/hooks';
import { StyledContainer, StyledHeadlineLarge } from 'shared/styles';

import { mockedActivities } from '../mock';
import { StyledTextBtn } from '../RespondentData.styles';
import { Feedback } from './Feedback';
import { StyledHeader, StyledReviewContainer } from './RespondentDataReview.styles';
import { Response } from './RespondentDataReview.types';
import { Review } from './Review';
import { ReviewMenu } from './ReviewMenu';

export const RespondentDataReview = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const activities = mockedActivities as unknown as Activity[];
  const [selectedActivity, setSelectedActivity] = useState<Activity>(activities[0]);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);

  return (
    <StyledContainer sx={{ position: 'relative' }}>
      <ReviewMenu
        activities={activities}
        selectedActivity={selectedActivity}
        selectedResponse={selectedResponse}
        setSelectedActivity={setSelectedActivity}
        setSelectedResponse={setSelectedResponse}
      />
      <StyledReviewContainer ref={containerRef}>
        <StyledHeader
          isSticky={isHeaderSticky}
          sx={{ justifyContent: selectedResponse ? 'space-between' : 'flex-end' }}
        >
          {selectedResponse && <StyledHeadlineLarge>{selectedActivity.name}</StyledHeadlineLarge>}
          <StyledTextBtn
            variant="text"
            onClick={() => setIsFeedbackOpen(true)}
            disabled={!selectedResponse}
            startIcon={<Svg id="item-outlined" width="18" height="18" />}
          >
            {t('feedback')}
          </StyledTextBtn>
        </StyledHeader>
        <Review response={selectedResponse} activity={selectedActivity} />
      </StyledReviewContainer>
      {isFeedbackOpen && <Feedback onClose={() => setIsFeedbackOpen(false)} />}
    </StyledContainer>
  );
};
