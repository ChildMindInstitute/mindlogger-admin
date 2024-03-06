import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { useHeaderSticky } from 'shared/hooks';
import { StyledStickyHeader, StyledStickyHeadline } from 'shared/styles';

import { StyledTextBtn } from '../../RespondentData.styles';
import { ReviewHeaderProps } from './ReviewHeader.types';

export const ReviewHeader = ({
  containerRef,
  isAnswerSelected,
  activityName,
  onButtonClick,
  'data-testid': dataTestid,
}: ReviewHeaderProps) => {
  const { t } = useTranslation();
  const isHeaderSticky = useHeaderSticky(containerRef);

  return (
    <StyledStickyHeader
      isSticky={isHeaderSticky}
      sx={{ justifyContent: isAnswerSelected ? 'space-between' : 'flex-end' }}
      data-testid={`${dataTestid}-sticky-header`}
    >
      {isAnswerSelected && (
        <StyledStickyHeadline isSticky={isHeaderSticky}>{activityName}</StyledStickyHeadline>
      )}
      <StyledTextBtn
        variant="text"
        onClick={onButtonClick}
        disabled={!isAnswerSelected}
        startIcon={<Svg id="item-outlined" width="18" height="18" />}
        data-testid={`${dataTestid}-feedback-button`}
      >
        {t('feedback')}
      </StyledTextBtn>
    </StyledStickyHeader>
  );
};
