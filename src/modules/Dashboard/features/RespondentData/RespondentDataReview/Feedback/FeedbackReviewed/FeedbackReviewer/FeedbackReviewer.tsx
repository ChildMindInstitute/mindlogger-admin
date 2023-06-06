import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CollapsedMdText } from 'modules/Dashboard/features/RespondentData/CollapsedMdText';
import { getDictionaryText } from 'shared/utils';
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
