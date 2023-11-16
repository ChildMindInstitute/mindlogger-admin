import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { getActivityAnswerApi } from 'api';
import { useAsync } from 'shared/hooks/useAsync';
import { getDictionaryText } from 'shared/utils';
import { Spinner } from 'shared/components';
import { EncryptedAnswerSharedProps } from 'shared/types';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { UNSUPPORTED_ITEMS } from 'modules/Dashboard/features/RespondentData/RespondentData.consts';

import { CollapsedMdText } from '../../CollapsedMdText';
import { UnsupportedItemResponse } from '../../UnsupportedItemResponse';
import { StyledReview } from './Review.styles';
import { ReviewProps } from './Review.types';
import { getResponseItem } from './Review.const';

export const Review = ({ answerId, activityId, 'data-testid': dataTestid }: ReviewProps) => {
  const { appletId } = useParams();
  const [activityItemAnswers, setActivityItemAnswers] = useState<
    | ReturnType<typeof getDecryptedActivityData<EncryptedAnswerSharedProps>>['decryptedAnswers']
    | null
  >(null);
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
          {activityItemAnswers.map((activityItemAnswer, index) => {
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
                  <UnsupportedItemResponse
                    itemType={responseType}
                    data-testid={`${testId}-response`}
                  />
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
      )}
    </>
  );
};
