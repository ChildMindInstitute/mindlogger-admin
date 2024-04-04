import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { format } from 'date-fns';

import { getDictionaryText } from 'shared/utils';
import { Svg } from 'shared/components/Svg';
import {
  StyledBodyMedium,
  StyledFlexTopStart,
  StyledTitleBoldMedium,
  theme,
  variables,
} from 'shared/styles';
import { CollapsedMdText } from 'modules/Dashboard/features/RespondentData/CollapsedMdText';
import { DateFormats } from 'shared/consts';

import {
  StyledItem,
  StyledRemoveWrapper,
  StyledReviewer,
  StyledShowMoreWrapper,
  StyledToggleButton,
} from './FeedbackReviewer.styles';
import { FeedbackReviewerProps } from './FeedbackReviewer.types';
import { getResponseItem } from './FeedbackReviewer.utils';
import { MIN_ANSWERS_COUNT_TO_SHOW } from './FeedbackReviewer.const';
import { RemoveReviewPopup } from '../RemoveReviewPopup';

export const FeedbackReviewer = ({
  review,
  reviewer,
  isCurrentUserReviewer,
  reviewId,
  createdAt,
  onReviewerAnswersRemove,
  error,
  isLoading,
  'data-testid': dataTestid,
}: FeedbackReviewerProps) => {
  const { t } = useTranslation('app');
  const [isOpen, setIsOpen] = useState(false);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [numAnswersToShow, setNumAnswersToShow] = useState(MIN_ANSWERS_COUNT_TO_SHOW);
  const [removePopupVisible, setRemovePopupVisible] = useState(false);

  const toggleIsOpen = () => setIsOpen((prevState) => !prevState);
  const handleRemoveButtonClick = () => setRemovePopupVisible(true);
  const handleRemoveSubmit = async () => {
    setIsOpen(false);
    await onReviewerAnswersRemove({ assessmentId: reviewId });
    setRemovePopupVisible(false);
  };
  const reviewerName = `${reviewer.firstName} ${reviewer.lastName}${
    isCurrentUserReviewer ? t('me') : ''
  }`;
  const reviewLength = review.length;
  const toggleShowReviews = () => {
    setShowAllAnswers((prevState) => {
      setNumAnswersToShow(prevState ? MIN_ANSWERS_COUNT_TO_SHOW : reviewLength);

      return !prevState;
    });
  };

  return (
    <>
      <StyledReviewer
        hasSmallerPaddingBottom={isCurrentUserReviewer && !isOpen}
        data-testid={dataTestid}
      >
        <StyledFlexTopStart sx={{ justifyContent: 'space-between' }}>
          <StyledTitleBoldMedium>{reviewerName}</StyledTitleBoldMedium>
          <StyledToggleButton onClick={toggleIsOpen} data-testid={`${dataTestid}-collapse`}>
            <Svg id={isOpen ? 'navigate-up' : 'navigate-down'} />
          </StyledToggleButton>
        </StyledFlexTopStart>
        <StyledBodyMedium
          sx={{
            color: variables.palette.outline,
            pt: theme.spacing(0.5),
          }}
        >{`${t('submitted')} ${format(
          new Date(`${createdAt}Z`),
          DateFormats.MonthDayYearTime,
        )}`}</StyledBodyMedium>
        {isCurrentUserReviewer && (
          <StyledRemoveWrapper>
            <Button
              variant="text"
              startIcon={<Svg width="18" height="18" id="trash" />}
              onClick={handleRemoveButtonClick}
              data-testid={`${dataTestid}-answers-remove`}
            >
              {t('remove')}
            </Button>
          </StyledRemoveWrapper>
        )}
        {isOpen && (
          <>
            {review.slice(0, numAnswersToShow).map((activityItemAnswer, index) => (
              <StyledItem
                key={activityItemAnswer.activityItem.id}
                isFirstItem={index === 0}
                data-testid={`${dataTestid}-review-${index}`}
              >
                <CollapsedMdText
                  text={getDictionaryText(activityItemAnswer.activityItem.question)}
                  maxHeight={120}
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
