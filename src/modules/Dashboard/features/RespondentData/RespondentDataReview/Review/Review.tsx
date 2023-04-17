import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/system';

import { getAnswerApi } from 'api';
import { Svg } from 'shared/components';
import { StyledTitleLarge, StyledTitleLargish, variables } from 'shared/styles';
import { useAsync } from 'shared/hooks';
import { getDictionaryText } from 'shared/utils';

import { CollapsedMdText } from '../../CollapsedMdText';
import { getItemLabel, isItemUnsupported } from '../../RespondentData.utils';
import { UnsupportedItemResponse } from '../../UnsupportedItemResponse';
import { StyledEmptyReview, StyledReview, StyledWrapper } from './Review.styles';
import { ReviewProps } from './Review.types';
import { ActivityItemAnswer } from '../RespondentDataReview.types';
import { getResponseItem } from './Review.const';

export const Review = ({ answerId }: ReviewProps) => {
  const { t } = useTranslation();
  const { appletId } = useParams();
  const [activityItemAnswers, setActivityItemAnswers] = useState<ActivityItemAnswer[] | null>(null);

  const { execute } = useAsync(
    getAnswerApi,
    (res) => res?.data?.result && setActivityItemAnswers(res.data.result.activityItemAnswers),
  );

  useEffect(() => {
    if (appletId && answerId) {
      execute({ appletId, answerId });
    }
  }, [appletId, answerId]);

  return (
    <>
      {answerId && activityItemAnswers ? (
        <StyledReview>
          {activityItemAnswers.map(({ activityItem, answer }) => (
            <Box sx={{ mb: 4.8 }} key={activityItem.id}>
              <StyledTitleLargish>{t(getItemLabel(activityItem.responseType))}</StyledTitleLargish>
              <CollapsedMdText text={getDictionaryText(activityItem.question)} maxHeight={120} />
              {isItemUnsupported(activityItem.responseType) ? (
                <UnsupportedItemResponse itemType={activityItem.responseType} />
              ) : (
                <>{getResponseItem({ activityItem, answer })}</>
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
