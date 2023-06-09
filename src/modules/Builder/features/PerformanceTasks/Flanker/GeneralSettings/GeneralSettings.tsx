import { useTranslation } from 'react-i18next';

import { StyledTitleLarge, theme } from 'shared/styles';

import { Instruction } from '../../Instruction';
import { SettingsTypeEnum } from '../Flanker.const';
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
      <Instruction
        description={t('performanceTaskInstructions.flankerGeneralDesc')}
        type={SettingsTypeEnum.General}
      />
      <ButtonsScreen />
      <FixationScreen />
      <StimulusScreen />
    </>
  );
};
