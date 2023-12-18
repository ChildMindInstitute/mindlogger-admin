import { Box } from '@mui/material';

import { getDictionaryText } from 'shared/utils';

import { UNSUPPORTED_ITEMS } from 'modules/Dashboard/features/RespondentData/RespondentData.consts';

import { CollapsedMdText } from '../../CollapsedMdText';
import { UnsupportedItemResponse } from '../../UnsupportedItemResponse';
import { StyledReview } from './Review.styles';
import { ReviewProps } from './Review.types';
import { getResponseItem } from './Review.const';

export const Review = ({ activityItemAnswers, 'data-testid': dataTestid }: ReviewProps) => (
  <StyledReview>
    {activityItemAnswers.map((activityItemAnswer: any, index: number) => {
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
