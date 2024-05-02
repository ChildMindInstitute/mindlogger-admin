import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { useHeaderSticky } from 'shared/hooks';
import { StyledStickyHeader, StyledStickyHeadline } from 'shared/styles';

import { StyledTextBtn } from '../../RespondentData.styles';
import { RespondentDataReviewContext } from '../RespondentDataReview.context';
import { ResponsesHeaderProps } from './ResponsesHeader.types';

export const ResponsesHeader = ({
  containerRef,
  isAnswerSelected,
  name,
  onButtonClick,
  'data-testid': dataTestid,
}: ResponsesHeaderProps) => {
  const { t } = useTranslation();
  const isHeaderSticky = useHeaderSticky(containerRef);
  const { isFeedbackOpen } = useContext(RespondentDataReviewContext);

  return (
    <StyledStickyHeader
      isSticky={isHeaderSticky}
      sx={{ justifyContent: isAnswerSelected ? 'space-between' : 'flex-end' }}
      data-testid={`${dataTestid}-sticky-header`}
    >
      {isAnswerSelected && (
        <StyledStickyHeadline isSticky={isHeaderSticky}>{name}</StyledStickyHeadline>
      )}
      {!isFeedbackOpen && (
        <StyledTextBtn
          variant="text"
          onClick={onButtonClick}
          disabled={!isAnswerSelected}
          startIcon={<Svg id="item-outlined" width="18" height="18" />}
          data-testid={`${dataTestid}-feedback-button`}
        >
          {t('feedback')}
        </StyledTextBtn>
      )}
    </StyledStickyHeader>
  );
};
