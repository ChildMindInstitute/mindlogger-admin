import { Fragment, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash.uniqueid';

import { EmptyState, Spinner } from 'shared/components';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { useAsync } from 'shared/hooks/useAsync';
import { getReviewsApi } from 'api';

import { StyledContainer } from './FeedbackReviewed.styles';
import { FeedbackReviewer } from './FeedbackReviewer';
import { Review, ReviewData } from './FeedbackReviewed.types';

export const FeedbackReviewed = () => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId');

  const getDecryptedActivityData = useDecryptedActivityData();
  const { execute: getReviews } = useAsync(
    getReviewsApi,
    (result) => {
      const decryptedData = result?.data.result.map((review) => {
        const { reviewerPublicKey, reviewer, ...assessmentData } = review;
        const encryptedData = {
          ...assessmentData,
          userPublicKey: reviewerPublicKey,
        } as Review;

        return {
          reviewer,
          review: getDecryptedActivityData(encryptedData).decryptedAnswers,
        };
      });

      setReviewers(decryptedData as ReviewData[]);
    },
    undefined,
    () => setIsLoading(false),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [reviewers, setReviewers] = useState<ReviewData[]>([]);
  const dataTestid = 'respondents-data-summary-feedback-reviewed';

  useEffect(() => {
    if (!appletId || !answerId) return;

    getReviews({ appletId, answerId });
  }, []);

  return (
    <StyledContainer>
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          {reviewers.length ? (
            reviewers.map((reviewer, index) => (
              <Fragment key={uniqueId()}>
                <FeedbackReviewer
                  reviewer={reviewer}
                  data-testid={`${dataTestid}-reviewer-${index}`}
                />
              </Fragment>
            ))
          ) : (
            <EmptyState>{t('reviewedEmptyState')}</EmptyState>
          )}
        </>
      )}
    </StyledContainer>
  );
};
