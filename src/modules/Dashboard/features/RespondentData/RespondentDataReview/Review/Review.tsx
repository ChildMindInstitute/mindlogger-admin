import { useEffect, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/system';

import { getActivityAnswerApi } from 'api';
import { useAsync } from 'shared/hooks';
import { getDictionaryText } from 'shared/utils';
import { Spinner } from 'shared/components';
import { page } from 'resources';
import { useDecryptedAnswers } from 'modules/Dashboard/hooks';

import { CollapsedMdText } from '../../CollapsedMdText';
import { isItemUnsupported } from '../../RespondentData.utils';
import { UnsupportedItemResponse } from '../../UnsupportedItemResponse';
import { StyledReview } from './Review.styles';
import { AnswersApiResponse, ReviewProps } from './Review.types';
import { ActivityItemAnswer } from '../RespondentDataReview.types';
import { getResponseItem } from './Review.const';

export const Review = ({ answerId, activityId }: ReviewProps) => {
  const { appletId, respondentId } = useParams();
  const navigate = useNavigate();
  const [activityItemAnswers, setActivityItemAnswers] = useState<ActivityItemAnswer[] | null>(null);
  const getDecryptedReviews = useDecryptedAnswers();

  const { execute: getActivityAnswer, isLoading } = useAsync(
    getActivityAnswerApi,
    (res) =>
      res?.data?.result &&
      setActivityItemAnswers(getDecryptedReviews(res.data.result as AnswersApiResponse)),
  );

  useEffect(() => {
    if (appletId && answerId) {
      getActivityAnswer({ appletId, answerId, activityId });
      navigate(
        generatePath(page.appletRespondentDataReviewAnswer, { appletId, respondentId, answerId }),
      );
    }
  }, [appletId, answerId]);

  return (
    <>
      {isLoading && <Spinner />}
      {answerId && activityItemAnswers && (
        <StyledReview>
          {activityItemAnswers.map(({ activityItem, answer }) => (
            <Box sx={{ mb: 4.8 }} key={activityItem.id}>
              <CollapsedMdText text={getDictionaryText(activityItem.question)} maxHeight={120} />
              {isItemUnsupported(activityItem.responseType) ? (
                <UnsupportedItemResponse itemType={activityItem.responseType} />
              ) : (
                <>{getResponseItem({ activityItem, answer })}</>
              )}
            </Box>
          ))}
        </StyledReview>
      )}
    </>
  );
};
