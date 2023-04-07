import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledHeadlineLarge, StyledTitleLarge, theme, variables } from 'shared/styles';

import { StyledEmptyReview, StyledReview } from './Review.styles';
import { ReviewProps } from './Review.types';

export const Review = ({ response, activity }: ReviewProps) => {
  const { t } = useTranslation();

  return (
    <>
      {response ? (
        <StyledReview>
          <StyledHeadlineLarge sx={{ m: theme.spacing(0, 14, 4.8, 0) }}>
            {activity.name}
          </StyledHeadlineLarge>
        </StyledReview>
      ) : (
        <StyledEmptyReview>
          <Svg id="data" width="60" height="73" />
          <StyledTitleLarge color={variables.palette.outline}>{t('emptyReview')}</StyledTitleLarge>
        </StyledEmptyReview>
      )}
    </>
  );
};
