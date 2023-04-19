import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StyledMdEditor } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/FeedbackAssessment/ActivityCardItemList/ActivityCardItem/ActivityCardItem.styles';
import { Svg } from 'shared/components';
import {
  StyledBodyMedium,
  StyledFlexTopStart,
  StyledTitleBoldMedium,
  variables,
} from 'shared/styles';

import { StyledButton, StyledEdited, StyledItem, StyledReviewer } from './FeedbackReviewer.styles';
import { FeedbackReviewerProps } from './FeedbackReviewer.types';
import { getResponseItem } from './FeedbackReviewer.const';

export const FeedbackReviewer = ({ reviewer }: FeedbackReviewerProps) => {
  const { t } = useTranslation('app');

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
              {activityItemAnswer.activityItem.edited && (
                <StyledEdited>
                  <StyledBodyMedium color={variables.palette.on_secondary_container}>
                    {t('edited')}
                  </StyledBodyMedium>
                </StyledEdited>
              )}
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
