import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash.uniqueid';

import { EmptyState, Spinner } from 'shared/components';
import { ExtendedExportAnswer } from 'shared/types';
import { useDecryptedAnswers } from 'modules/Dashboard/hooks';
import { useAsync } from 'shared/hooks';
import { getReviewsApi } from 'api';

import { StyledContainer } from './FeedbackReviewed.styles';
import { FeedbackReviewer } from './FeedbackReviewer';
import { Review, Reviewer } from './FeedbackReviewed.types';

export const FeedbackReviewed = () => {
  const { t } = useTranslation('app');
  const { appletId, answerId } = useParams();

  const getDecryptedReviews = useDecryptedAnswers();
  const { execute: getReviews } = useAsync(getReviewsApi);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);

  useEffect(() => {
    if (!appletId || !answerId) return;

    (async () => {
      try {
        const result = await getReviews({ appletId, answerId });
        const decryptedData = result.data.result.map((review: Review) => {
          const { reviewerPublicKey, isEdited, reviewer, ...assessmentData } = review;
          const encryptedData = {
            ...assessmentData,
            userPublicKey: reviewerPublicKey,
          } as ExtendedExportAnswer;

          return {
            isEdited,
            reviewer,
            review: getDecryptedReviews(encryptedData),
          };
        });

        setReviewers(decryptedData);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <StyledContainer>
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          {reviewers.length ? (
            reviewers.map((reviewer) => (
              <Fragment key={uniqueId()}>
                <FeedbackReviewer reviewer={reviewer} />
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
