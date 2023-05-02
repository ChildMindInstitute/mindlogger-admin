import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/system';

import { getAnswerApi } from 'api';
import { useAsync } from 'shared/hooks';
import { getDictionaryText } from 'shared/utils';
import { Spinner } from 'shared/components';
import { page } from 'resources';

import { CollapsedMdText } from '../../CollapsedMdText';
import { isItemUnsupported } from '../../RespondentData.utils';
import { UnsupportedItemResponse } from '../../UnsupportedItemResponse';
import { StyledReview } from './Review.styles';
import { ReviewProps } from './Review.types';
import { ActivityItemAnswer } from '../RespondentDataReview.types';
import { getResponseItem } from './Review.const';

export const Review = ({ answerId }: ReviewProps) => {
  const { appletId, respondentId } = useParams();
  const navigate = useNavigate();
  const [activityItemAnswers, setActivityItemAnswers] = useState<ActivityItemAnswer[] | null>(null);

  const { execute, isLoading } = useAsync(
    getAnswerApi,
    (res) => res?.data?.result && setActivityItemAnswers(res.data.result.activityItemAnswers),
  );

  useEffect(() => {
    if (appletId && answerId) {
      execute({ appletId, answerId });
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
