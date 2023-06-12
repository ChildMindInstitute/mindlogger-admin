import { useTranslation } from 'react-i18next';

import { StyledHeadlineLarge, theme } from 'shared/styles';
import { useBreadcrumbs } from 'shared/hooks';

import { PerformanceTaskHeader } from '../PerformanceTaskHeader';
import { NameDescription } from '../NameDescription';
import { GeneralSettings } from './GeneralSettings';
import { StyledPerformanceTaskBody } from '../PerformanceTasks.styles';
import { RoundSettings, RoundTypeEnum } from './RoundSettings';

export const Flanker = () => {
  const { t } = useTranslation();
  useBreadcrumbs();

  return (
    <>
      <PerformanceTaskHeader />
      <StyledPerformanceTaskBody sx={{ p: theme.spacing(2.4, 6.4) }}>
        <StyledHeadlineLarge sx={{ mb: theme.spacing(3) }}>{t('flanker')}</StyledHeadlineLarge>
        <NameDescription />
        <GeneralSettings />
        <RoundSettings uiType={RoundTypeEnum.Practice} />
        <RoundSettings uiType={RoundTypeEnum.Test} />
      </StyledPerformanceTaskBody>
    </>
  );
};
