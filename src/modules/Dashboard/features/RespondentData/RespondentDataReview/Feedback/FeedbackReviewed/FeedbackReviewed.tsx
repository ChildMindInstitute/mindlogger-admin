import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyTable } from 'shared/components';

import { StyledContainer } from './FeedbackReviewed.styles';
import { FeedbackReviewer } from './FeedbackReviewer';
import { mockedReviewers } from './mock';

export const FeedbackReviewed = () => {
  const { t } = useTranslation('app');

  const reviewers = mockedReviewers;

  return (
    <StyledContainer sx={{ justifyContent: reviewers?.length ? 'inherit' : 'center' }}>
      {reviewers?.length ? (
        reviewers.map((reviewer) => (
          <Fragment key={reviewer.id}>
            <FeedbackReviewer reviewer={reviewer} />
          </Fragment>
        ))
      ) : (
        <EmptyTable>{t('reviewedEmptyState')}</EmptyTable>
      )}
    </StyledContainer>
  );
};
