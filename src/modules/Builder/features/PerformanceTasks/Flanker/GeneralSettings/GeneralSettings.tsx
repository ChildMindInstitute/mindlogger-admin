import { useTranslation } from 'react-i18next';

import { StyledTitleLarge, theme } from 'shared/styles';

import { OverviewInstruction } from '../../OverviewInstruction';
import { ButtonsScreen } from './ButtonsScreen';
import { FixationScreen } from './FixationScreen';
import { StimulusScreen } from './StimulusScreen';

export const GeneralSettings = () => {
  const { t } = useTranslation();

  return (
    <>
      <StyledTitleLarge sx={{ p: theme.spacing(1, 0, 2.4) }}>
        {t('generalSettings')}
      </StyledTitleLarge>
      <OverviewInstruction description={t('performanceTaskInstructions.flankerGeneralDesc')} />
      <ButtonsScreen />
      <FixationScreen />
      <StimulusScreen />
    </>
  );
};
