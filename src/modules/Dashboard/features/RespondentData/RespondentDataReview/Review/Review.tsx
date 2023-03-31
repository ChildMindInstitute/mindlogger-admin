import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledTitleLarge, variables } from 'shared/styles';

import { ReviewType } from '../RespondentDataReview.types';
import { StyledEmptyReview } from './Review.styles';

export const Review = ({ review }: { review: ReviewType | null }) => {
  const { t } = useTranslation();
  const isReviewEmpty = true;

  return (
    <>
      {isReviewEmpty && (
        <StyledEmptyReview>
          <Svg id="data" width="60" height="73" />
          <StyledTitleLarge color={variables.palette.outline}>{t('emptyReview')}</StyledTitleLarge>
        </StyledEmptyReview>
      )}
    </>
  );
};
