import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledTitleBoldMedium } from 'shared/styles/styledComponents';

import { AddReviewProps } from './AddReview.types';
import { StyledAddReviewWrapper, StyledAddButtonWrapper } from './AddReview.styles';

export const AddReview = ({ userName, onAddReview, 'data-testid': dataTestid }: AddReviewProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledAddReviewWrapper data-testid={`${dataTestid}-empty-review`}>
      <StyledTitleBoldMedium>{userName}</StyledTitleBoldMedium>
      <StyledAddButtonWrapper>
        <Button
          variant="contained"
          startIcon={<Svg width="18" height="18" id="add" />}
          onClick={onAddReview}
          data-testid={`${dataTestid}-add-review`}
        >
          {t('addReview')}
        </Button>
      </StyledAddButtonWrapper>
    </StyledAddReviewWrapper>
  );
};
