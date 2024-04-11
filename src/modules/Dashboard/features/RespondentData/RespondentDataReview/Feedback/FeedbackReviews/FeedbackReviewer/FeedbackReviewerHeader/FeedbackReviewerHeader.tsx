import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { format } from 'date-fns';

import { Svg } from 'shared/components/Svg';
import { Tooltip } from 'shared/components/Tooltip';
import {
  StyledBodyMedium,
  StyledFlexTopCenter,
  StyledTitleBoldMedium,
  theme,
  variables,
} from 'shared/styles';
import { DateFormats } from 'shared/consts';

import {
  StyledLock,
  StyledRemoveWrapper,
  StyledToggleButton,
} from './FeedbackReviewerHeader.styles';
import { FeedbackReviewerHeaderProps } from './FeedbackReviewerHeader.types';

export const FeedbackReviewerHeader = ({
  isReviewOpen,
  reviewerName,
  hasReview,
  createdAt,
  onToggleVisibilityClick,
  onRemoveClick,
  'data-testid': dataTestid,
}: FeedbackReviewerHeaderProps) => {
  const { t } = useTranslation('app');
  const toggleSvgId = isReviewOpen ? 'navigate-up' : 'navigate-down';
  const submittedDate = `${t('submitted')} ${format(
    new Date(createdAt),
    DateFormats.MonthDayYearTime,
  )}`;

  return (
    <>
      <StyledFlexTopCenter sx={{ justifyContent: 'space-between' }}>
        <StyledTitleBoldMedium>{reviewerName}</StyledTitleBoldMedium>
        {hasReview ? (
          <StyledToggleButton
            onClick={onToggleVisibilityClick}
            data-testid={`${dataTestid}-collapse`}
          >
            <Svg id={toggleSvgId} />
          </StyledToggleButton>
        ) : (
          <Tooltip tooltipTitle={t('noPermissionToViewData')}>
            <StyledLock data-testid={`${dataTestid}-lock`}>
              <Svg width="1.9rem" height="1.9rem" id="lock" />
            </StyledLock>
          </Tooltip>
        )}
      </StyledFlexTopCenter>
      <StyledBodyMedium
        sx={{
          color: variables.palette.outline,
          pt: theme.spacing(0.5),
        }}
      >
        {submittedDate}
      </StyledBodyMedium>
      {onRemoveClick && (
        <StyledRemoveWrapper>
          <Button
            variant="text"
            startIcon={<Svg width="18" height="18" id="trash" />}
            onClick={onRemoveClick}
            data-testid={`${dataTestid}-answers-remove`}
          >
            {t('remove')}
          </Button>
        </StyledRemoveWrapper>
      )}
    </>
  );
};
