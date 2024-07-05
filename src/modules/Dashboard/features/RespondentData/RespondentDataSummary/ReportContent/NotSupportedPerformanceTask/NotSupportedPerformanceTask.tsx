import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledTitleLarge, theme, variables } from 'shared/styles';

export const NotSupportedPerformanceTask = () => {
  const { t } = useTranslation('app');

  return (
    <>
      <Svg id="confused" width="80" height="80" />
      <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
        {t('datavizNotSupportedForPerformanceTasks')}
      </StyledTitleLarge>
    </>
  );
};
