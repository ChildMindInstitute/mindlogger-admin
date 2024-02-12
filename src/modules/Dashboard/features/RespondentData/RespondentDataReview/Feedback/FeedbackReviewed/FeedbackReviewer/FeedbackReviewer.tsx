import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { getDictionaryText } from 'shared/utils';
import { Svg } from 'shared/components/Svg';
import {
  StyledBodyMedium,
  StyledFlexTopStart,
  StyledTitleBoldMedium,
  variables,
} from 'shared/styles';
import { CollapsedMdText } from 'modules/Dashboard/features/RespondentData/CollapsedMdText';

import { StyledButton, StyledEdited, StyledItem, StyledReviewer } from './FeedbackReviewer.styles';
import { FeedbackReviewerProps } from './FeedbackReviewer.types';
import { getResponseItem } from './FeedbackReviewer.utils';

export const FeedbackReviewer = ({
  reviewer: { review, reviewer },
  'data-testid': dataTestid,
}: FeedbackReviewerProps) => {
  const { t } = useTranslation('app');

  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen((state) => !state);
  };

  return (
    <StyledReviewer data-testid={dataTestid}>
      <StyledFlexTopStart sx={{ justifyContent: 'space-between' }}>
        <StyledTitleBoldMedium>{`${reviewer.firstName} ${reviewer.lastName}`}</StyledTitleBoldMedium>
        <StyledButton onClick={toggleIsOpen} data-testid={`${dataTestid}-collapse`}>
          <Svg id={isOpen ? 'navigate-up' : 'navigate-down'} />
        </StyledButton>
      </StyledFlexTopStart>
      {isOpen && (
        <>
          {review.map((activityItemAnswer, index) => (
            <StyledItem
              key={activityItemAnswer.activityItem.id}
              data-testid={`${dataTestid}-review-${index}`}
            >
              {activityItemAnswer.answer?.edited && (
                <StyledEdited data-testid={`${dataTestid}-review-${index}-edited`}>
                  <StyledBodyMedium color={variables.palette.on_secondary_container}>
                    {t('edited')}
                  </StyledBodyMedium>
                </StyledEdited>
              )}
              <CollapsedMdText
                text={getDictionaryText(activityItemAnswer.activityItem.question)}
                maxHeight={120}
              />
              {getResponseItem(activityItemAnswer)}
            </StyledItem>
          ))}
        </>
      )}
    </StyledReviewer>
  );
};
