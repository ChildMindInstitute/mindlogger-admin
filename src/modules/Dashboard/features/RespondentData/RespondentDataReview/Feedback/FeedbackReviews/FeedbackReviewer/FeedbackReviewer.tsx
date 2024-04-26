import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { getDictionaryText, toggleBooleanState } from 'shared/utils';
import { CollapsedMdText } from 'modules/Dashboard/features/RespondentData/CollapsedMdText';
import { SHOW_MORE_HEIGHT } from 'modules/Dashboard/features/RespondentData/RespondentData.const';

import { StyledItem, StyledReviewer, StyledShowMoreWrapper } from './FeedbackReviewer.styles';
import { FeedbackReviewerProps } from './FeedbackReviewer.types';
import { getResponseItem } from './FeedbackReviewer.utils';
import { MIN_ANSWERS_COUNT_TO_SHOW } from './FeedbackReviewer.const';
import { RemoveReviewPopup } from '../RemoveReviewPopup';
import { FeedbackReviewerHeader } from './FeedbackReviewerHeader';

export const FeedbackReviewer = ({
  review,
  reviewer,
  isCurrentUserReviewer,
  reviewId,
  updatedAt,
  onReviewerAnswersRemove,
  onReviewEdit,
  error,
  isLoading,
  'data-testid': dataTestid,
}: FeedbackReviewerProps) => {
  const { t } = useTranslation('app');
  const [isOpen, setIsOpen] = useState(false);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [numAnswersToShow, setNumAnswersToShow] = useState(MIN_ANSWERS_COUNT_TO_SHOW);
  const [removePopupVisible, setRemovePopupVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleRemoveButtonClick = () => setRemovePopupVisible(true);
  const handleEditButtonClick = () => {
    setIsVisible(false);
    onReviewEdit();
  };
  const handleRemoveSubmit = async () => {
    setIsOpen(false);
    await onReviewerAnswersRemove({ assessmentId: reviewId });
    setRemovePopupVisible(false);
  };
  const reviewerName = `${reviewer.firstName} ${reviewer.lastName}${
    isCurrentUserReviewer ? t('me') : ''
  }`;
  const reviewLength = review?.length ?? 0;
  const toggleShowReviews = () => {
    setShowAllAnswers((prevState) => {
      setNumAnswersToShow(prevState ? MIN_ANSWERS_COUNT_TO_SHOW : reviewLength);

      return !prevState;
    });
  };

  if (!isVisible) return null;

  return (
    <>
      <StyledReviewer
        hasSmallerPaddingBottom={isCurrentUserReviewer && !isOpen}
        data-testid={dataTestid}
      >
        <FeedbackReviewerHeader
          isReviewOpen={isOpen}
          reviewerName={reviewerName}
          hasReview={!!review}
          submitDate={updatedAt}
          hasEditAndRemove={isCurrentUserReviewer}
          onRemoveClick={handleRemoveButtonClick}
          onEditClick={handleEditButtonClick}
          onToggleVisibilityClick={toggleBooleanState(setIsOpen)}
          data-testid={dataTestid}
        />
        {isOpen && (
          <>
            {review?.slice(0, numAnswersToShow).map((activityItemAnswer, index) => (
              <StyledItem
                key={activityItemAnswer.activityItem.id}
                isFirstItem={index === 0}
                data-testid={`${dataTestid}-review-${index}`}
              >
                <CollapsedMdText
                  text={getDictionaryText(activityItemAnswer.activityItem.question)}
                  maxHeight={SHOW_MORE_HEIGHT}
                />
                {getResponseItem(activityItemAnswer)}
              </StyledItem>
            ))}
            {reviewLength > MIN_ANSWERS_COUNT_TO_SHOW && (
              <StyledShowMoreWrapper>
                <Button
                  variant="text"
                  onClick={toggleShowReviews}
                  data-testid={`${dataTestid}-show-more`}
                >
                  {t(showAllAnswers ? 'showLessWithoutDots' : 'showMoreWithQuantity', {
                    quantity: reviewLength - MIN_ANSWERS_COUNT_TO_SHOW,
                  })}
                </Button>
              </StyledShowMoreWrapper>
            )}
          </>
        )}
      </StyledReviewer>
      {removePopupVisible && (
        <RemoveReviewPopup
          popupVisible={removePopupVisible}
          onClose={() => setRemovePopupVisible(false)}
          onSubmit={handleRemoveSubmit}
          error={error}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
