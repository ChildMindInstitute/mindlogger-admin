import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledTitleLarge, theme, variables } from 'shared/styles';

import { StyledEmptyState } from './NoData.styles';
import { NoDataProps } from './NoData.types';

export const NoData = ({ showNoDataForFilters, showNoDataForEmptyVersions }: NoDataProps) => {
  const { t } = useTranslation('app');

  if (showNoDataForFilters) {
    return (
      <StyledEmptyState data-testid="report-empty-state">
        <Svg id="chart" width="80" height="80" />
        <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
          {t('noDataForFilters')}
        </StyledTitleLarge>
      </StyledEmptyState>
    );
  }

  if (showNoDataForEmptyVersions) {
    return (
      <StyledEmptyState data-testid="report-with-empty-version-filter">
        <Svg id="not-found" width="80" height="80" />
        <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
          {t('noDataForEmptyVersionsFilter')}
        </StyledTitleLarge>
      </StyledEmptyState>
    );
  }

  return null;
};
