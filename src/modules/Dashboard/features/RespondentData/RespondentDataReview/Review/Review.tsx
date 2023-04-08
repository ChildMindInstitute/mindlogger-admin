import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledTitleLarge, StyledTitleLargish, variables } from 'shared/styles';

import { CollapsedMdText } from '../../CollapsedMdText';
import { getItemLabel, isItemUnsupported } from '../../RespondentData.utils';
import { UnsupportedItemResponse } from '../../UnsupportedItemResponse';
import { StyledEmptyReview, StyledReview, StyledWrapper } from './Review.styles';
import { ReviewProps } from './Review.types';

export const Review = ({ response, activity }: ReviewProps) => {
  const { t } = useTranslation();

  return (
    <>
      {response ? (
        <StyledReview>
          {activity.items.map((item) => (
            <Box sx={{ mb: 4.8 }} key={item.id}>
              <StyledTitleLargish>{t(getItemLabel(item.responseType))}</StyledTitleLargish>
              <CollapsedMdText text={item.question as string} maxHeight={120} />
              {isItemUnsupported(item.responseType) ? (
                <UnsupportedItemResponse itemType={item.responseType} />
              ) : (
                <></>
              )}
            </Box>
          ))}
        </StyledReview>
      ) : (
        <StyledWrapper>
          <StyledEmptyReview>
            <Svg id="data" width="60" height="73" />
            <StyledTitleLarge color={variables.palette.outline}>
              {t('emptyReview')}
            </StyledTitleLarge>
          </StyledEmptyReview>
        </StyledWrapper>
      )}
    </>
  );
};
