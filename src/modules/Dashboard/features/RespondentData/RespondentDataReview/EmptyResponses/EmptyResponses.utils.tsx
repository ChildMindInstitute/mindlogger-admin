import { Svg } from 'shared/components/Svg';
import { StyledErrorText, StyledTitleLarge, theme, variables } from 'shared/styles';
import i18n from 'i18n';

import { EmptyResponsesProps } from './EmptyResponses.types';

const { t } = i18n;

export const renderEmptyState = ({
  isActivityOrFlowSelected,
  isAnswerSelected,
  error,
}: Omit<EmptyResponsesProps, 'hasAnswers' | 'data-testid'>) => {
  if (!isActivityOrFlowSelected || !isAnswerSelected) {
    return (
      <>
        <Svg id="data" width="80" height="80" />
        <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
          {t('emptyReview')}
        </StyledTitleLarge>
      </>
    );
  }
  if (error) {
    return <StyledErrorText>{error}</StyledErrorText>;
  }

  return (
    <>
      <Svg id="chart" width="67" height="67" />
      <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
        {t('noAvailableData')}
      </StyledTitleLarge>
    </>
  );
};
