import i18n from 'i18n';
import { DatavizActivity } from 'api';
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
  if (!selectedActivity.hasAnswer) {
    return (
      <>
        <Svg id="chart" width="80" height="80" />
        <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
          {t('noDataForActivity')}
        </StyledTitleLarge>
      </>
    );
  }
};
