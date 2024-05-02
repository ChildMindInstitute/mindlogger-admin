import { Box } from '@mui/material';

import { getDictionaryText } from 'shared/utils';
import { SHOW_MORE_HEIGHT } from 'modules/Dashboard/features/RespondentData/RespondentData.const';

import { CollapsedMdText } from '../../CollapsedMdText';
import { UnsupportedItemResponse } from '../../UnsupportedItemResponse';
import { UNSUPPORTED_ITEMS } from '../../RespondentData.const';
import { StyledReview } from './ActivityResponses.styles';
import { ActivityResponsesProps } from './ActivityResponses.types';
import { getResponseItem } from './ActivityResponses.utils';

export const ActivityResponses = ({
  activityAnswers,
  'data-testid': dataTestid,
}: ActivityResponsesProps) => (
  <StyledReview data-testid={dataTestid}>
    {activityAnswers?.map((activityAnswer, index) => {
      const testId = `${dataTestid}-${index}`;
      const {
        activityItem: { id, question, responseType },
      } = activityAnswer;

      return (
        <Box sx={{ mb: 4.8 }} key={id} data-testid={testId}>
          <CollapsedMdText
            text={getDictionaryText(question)}
            maxHeight={SHOW_MORE_HEIGHT}
            data-testid={`${testId}-question`}
          />
          {UNSUPPORTED_ITEMS.includes(responseType) ? (
            <UnsupportedItemResponse itemType={responseType} data-testid={`${testId}-response`} />
          ) : (
            <>
              {getResponseItem({
                ...activityAnswer,
                'data-testid': `${testId}-response`,
              })}
            </>
          )}
        </Box>
      );
    })}
  </StyledReview>
);
