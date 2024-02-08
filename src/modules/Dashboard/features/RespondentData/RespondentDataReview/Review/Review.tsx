import { Box } from '@mui/material';

import { UNSUPPORTED_ITEMS } from 'modules/Dashboard/features/RespondentData/RespondentData.consts';
import { getDictionaryText } from 'shared/utils';

import { CollapsedMdText } from '../../CollapsedMdText';
import { UnsupportedItemResponse } from '../../UnsupportedItemResponse';
import { StyledEmptyReview, StyledReview, StyledWrapper } from './Review.styles';
import { ReviewProps } from './Review.types';
import { renderEmptyState, getResponseItem } from './Review.utils';

export const Review = ({
  activityItemAnswers,
  isLoading,
  selectedAnswer,
  'data-testid': dataTestid,
}: ReviewProps) => {
  if ((!selectedAnswer && !isLoading) || !activityItemAnswers)
    return (
      <StyledWrapper>
        <StyledEmptyReview>{renderEmptyState(selectedAnswer)}</StyledEmptyReview>
      </StyledWrapper>
    );

  return (
    <StyledReview data-testid={dataTestid}>
      {activityItemAnswers?.map((activityItemAnswer, index) => {
        const testId = `${dataTestid}-${index}`;
        const {
          activityItem: { id, question, responseType },
        } = activityItemAnswer;

        return (
          <Box sx={{ mb: 4.8 }} key={id} data-testid={testId}>
            <CollapsedMdText
              text={getDictionaryText(question)}
              maxHeight={120}
              data-testid={`${testId}-question`}
            />
            {UNSUPPORTED_ITEMS.includes(responseType) ? (
              <UnsupportedItemResponse itemType={responseType} data-testid={`${testId}-response`} />
            ) : (
              <>
                {getResponseItem({
                  ...activityItemAnswer,
                  'data-testid': `${testId}-response`,
                })}
              </>
            )}
          </Box>
        );
      })}
    </StyledReview>
  );
};
