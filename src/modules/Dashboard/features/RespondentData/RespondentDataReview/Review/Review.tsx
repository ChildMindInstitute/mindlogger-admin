import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { getActivityAnswerApi } from 'api';
import { useAsync } from 'shared/hooks/useAsync';
import { getDictionaryText } from 'shared/utils';
import { Spinner } from 'shared/components';
import { ActivityItemAnswer } from 'shared/types';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { UNSUPPORTED_ITEMS } from 'modules/Dashboard/features/RespondentData/RespondentData.consts';

import { CollapsedMdText } from '../../CollapsedMdText';
import { UnsupportedItemResponse } from '../../UnsupportedItemResponse';
import { StyledReview } from './Review.styles';
import { ReviewProps } from './Review.types';
import { getResponseItem } from './Review.const';

export const Review = ({ answerId, activityId, 'data-testid': dataTestid }: ReviewProps) => {
  const { appletId } = useParams();
  const [activityItemAnswers, setActivityItemAnswers] = useState<ActivityItemAnswer[] | null>(null);
  const getDecryptedActivityData = useDecryptedActivityData();

  const { execute: getActivityAnswer, isLoading } = useAsync(getActivityAnswerApi, (res) => {
    if (!res?.data?.result) return;

    const decryptedActivityData = getDecryptedActivityData(res.data.result);
    setActivityItemAnswers(decryptedActivityData.decryptedAnswers);
  });

  useEffect(() => {
    if (appletId && answerId) {
      getActivityAnswer({ appletId, answerId, activityId });
    }
  }, [appletId, answerId]);

  return (
    <>
      {isLoading && <Spinner />}
      {answerId && activityItemAnswers && (
        <StyledReview>
          {activityItemAnswers.map(({ activityItem, answer }, index) => {
            const testId = `${dataTestid}-${index}`;

            return (
              <Box sx={{ mb: 4.8 }} key={activityItem.id} data-testid={testId}>
                <CollapsedMdText
                  text={getDictionaryText(activityItem.question)}
                  maxHeight={120}
                  data-testid={`${testId}-question`}
                />
                {UNSUPPORTED_ITEMS.includes(activityItem.responseType) ? (
                  <UnsupportedItemResponse
                    itemType={activityItem.responseType}
                    data-testid={`${testId}-response`}
                  />
                ) : (
                  <>
                    {getResponseItem({
                      activityItem,
                      answer,
                      'data-testid': `${testId}-response`,
                    })}
                  </>
                )}
              </Box>
            );
          })}
        </StyledReview>
      )}
    </>
  );
};
