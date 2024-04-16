import { DatavizActivity } from 'modules/Dashboard/api';
import i18n from 'i18n';
import { Svg } from 'shared/components/Svg';
import { StyledTitleLarge, theme, variables } from 'shared/styles';

export const getEmptyState = (selectedActivity: DatavizActivity | null) => {
  const { t } = i18n;

  if (!selectedActivity) {
    return (
      <>
        <Svg id="data" width="80" height="80" />
        <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
          {t('selectTheActivityToReview')}
        </StyledTitleLarge>
      </>
    );
  }
  if (selectedActivity.isPerformanceTask) {
    return (
      <>
        <Svg id="confused" width="80" height="80" />
        <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
          {t('datavizNotSupportedForPerformanceTasks')}
        </StyledTitleLarge>
      </>
    );
  }
};
