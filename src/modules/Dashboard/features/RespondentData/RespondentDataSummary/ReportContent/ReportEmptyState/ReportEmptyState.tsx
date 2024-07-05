import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledTitleLarge, theme, variables } from 'shared/styles';

import { ReportContentProps } from '../ReportContent.types';
import { NotSupportedPerformanceTask } from '../NotSupportedPerformanceTask';

export const ReportEmptyState = ({ selectedEntity }: Omit<ReportContentProps, 'isLoading'>) => {
  const { t } = useTranslation('app');

  if (!selectedEntity) {
    return (
      <>
        <Svg id="data" width="80" height="80" />
        <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
          {t('selectActivityOrFlowToReview')}
        </StyledTitleLarge>
      </>
    );
  }

  if (selectedEntity.isPerformanceTask) {
    return <NotSupportedPerformanceTask />;
  }

  return null;
};
