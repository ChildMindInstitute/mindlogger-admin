import { useTranslation } from 'react-i18next';

import { StyledTitleLarge, theme } from 'shared/styles';

import { OverviewInstruction } from '../../OverviewInstruction';

export const GeneralSettings = () => {
  const { t } = useTranslation();

  return (
    <>
      <StyledTitleLarge sx={{ p: theme.spacing(1, 0, 2.4) }}>
        {t('generalSettings')}
      </StyledTitleLarge>
      <OverviewInstruction description={t('performanceTaskInstructions.generalSettings')} />
    </>
  );
};
