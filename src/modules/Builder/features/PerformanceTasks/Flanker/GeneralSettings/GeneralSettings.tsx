import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { StyledTitleLarge, theme } from 'shared/styles';
import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { FlankerInstructionPositions } from 'modules/Builder/types';

import { Instruction } from '../../Instruction';
import { ButtonsScreen } from './ButtonsScreen';
import { FixationScreen } from './FixationScreen';
import { StimulusScreen } from './StimulusScreen';

export const GeneralSettings = () => {
  const { t } = useTranslation();
  const { fieldName, activityObjField } = useCurrentActivity();
  const {
    formState: { errors },
  } = useCustomFormContext();

  const hasError = !!get(errors, `${activityObjField}.items[${FlankerInstructionPositions.General}].question`);

  return (
    <>
      <StyledTitleLarge sx={{ p: theme.spacing(1, 0, 2.4) }}>{t('generalSettings')}</StyledTitleLarge>
      <Instruction
        name={`${fieldName}.items.${FlankerInstructionPositions.General}.question`}
        description={t('flankerInstructions.generalDesc')}
        hasError={hasError}
        instructionId={`instruction-${FlankerInstructionPositions.General}`}
        data-testid="builder-activity-flanker-general-instruction"
      />
      <ButtonsScreen />
      <FixationScreen />
      <StimulusScreen />
    </>
  );
};
