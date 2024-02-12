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
import { AssessmentActivityItem } from '../../RespondentDataReview.types';

export const FeedbackReviewed = () => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId');

  const getDecryptedActivityData = useDecryptedActivityData();
  const { execute: getReviews } = useAsync(
    getReviewsApi,
    async (result) => {
      const reviews = result?.data?.result ?? [];
      const decryptedData: ReviewData[] = [];

      for await (const review of reviews) {
        const { reviewerPublicKey, reviewer, ...assessmentData } = review;
        const encryptedData = {
          ...assessmentData,
          userPublicKey: reviewerPublicKey,
        } as Review;

        decryptedData.push({
          reviewer,
          review: (await getDecryptedActivityData(encryptedData))
            .decryptedAnswers as AssessmentActivityItem[],
        });
      }

      setReviewers(decryptedData);
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
