import { useState } from 'react';

import { StyledMdEditor } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/FeedbackAssessment/ActivityCardItemList/ActivityCardItem/ActivityCardItem.styles';
import { Svg } from 'shared/components';
import { StyledFlexTopStart, StyledTitleBoldMedium } from 'shared/styles';

import { StyledButton, StyledItem, StyledReviewer } from './FeedbackReviewer.styles';
import { FeedbackReviewerProps } from './FeedbackReviewer.types';
import { getResponseItem } from './FeedbackReviewer.const';

export const FeedbackReviewer = ({ reviewer }: FeedbackReviewerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen((state) => !state);
  };

  return (
    <StyledReviewer>
      <StyledFlexTopStart sx={{ justifyContent: 'space-between' }}>
        <StyledTitleBoldMedium>{reviewer.fullName}</StyledTitleBoldMedium>
        <StyledButton onClick={toggleIsOpen}>
          <Svg id={isOpen ? 'navigate-up' : 'navigate-down'} />
        </StyledButton>
      </StyledFlexTopStart>
      {isOpen && (
        <>
          {reviewer.activityItemAnswers.map((activityItemAnswer) => (
            <StyledItem key={activityItemAnswer.activityItem.id}>
              <StyledMdEditor
                modelValue={activityItemAnswer.activityItem.question as string}
                previewOnly
              />
              {getResponseItem(activityItemAnswer)}
            </StyledItem>
          ))}
        </>
      )}
    </StyledReviewer>
  );
};
