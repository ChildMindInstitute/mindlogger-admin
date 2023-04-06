import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Activity } from 'redux/modules';
import { Svg } from 'shared/components';
import { StyledContainer } from 'shared/styles';

import { mockedActivities } from '../mock';
import { Feedback } from './Feedback';
import { StyledFeedbackBtn, StyledReviewContainer } from './RespondentDataReview.styles';
import { Response } from './RespondentDataReview.types';
import { Review } from './Review';
import { ReviewMenu } from './ReviewMenu';

export const RespondentDataReview = () => {
  const { t } = useTranslation();
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
      <StyledReviewContainer>
        <StyledFeedbackBtn
          variant="text"
          onClick={() => setIsFeedbackOpen(true)}
          startIcon={<Svg id="item-outlined" width="18" height="18" />}
        >
          {t('feedback')}
        </StyledFeedbackBtn>
        <Review response={selectedResponse} activity={selectedActivity} />
      </StyledReviewContainer>
      {isFeedbackOpen && <Feedback onClose={() => setIsFeedbackOpen(false)} />}
    </StyledContainer>
  );
};
