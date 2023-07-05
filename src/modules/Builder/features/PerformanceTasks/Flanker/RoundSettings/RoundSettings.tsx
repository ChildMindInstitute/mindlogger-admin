import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { StyledTitleLarge, theme } from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { FlankerInstructionPositions, RoundTypeEnum } from 'modules/Builder/types';

import { Instruction } from '../../Instruction';
import { RoundOptions } from './RoundOptions';
import { RoundSettingsProps } from './RoundSettings.types';
import { BlockSequences } from './BlockSequences';

export const RoundSettings = ({ uiType }: RoundSettingsProps) => {
  const { t } = useTranslation();
  const isPracticeRound = uiType === RoundTypeEnum.Practice;
  const { fieldName, activityObjField } = useCurrentActivity();
  const {
    formState: { errors },
  } = useFormContext();

  const hasPracticeInstructionError = !!get(
    errors,
    `${activityObjField}.items[${FlankerInstructionPositions.Practice}].question`,
  );
  const hasTestInstructionError = !!get(
    errors,
    `${activityObjField}.items[${FlankerInstructionPositions.Test}].question`,
  );

  return (
    <>
      <StyledTitleLarge sx={{ p: theme.spacing(1, 0, 2.4) }}>
        {t(`flankerRound.${isPracticeRound ? 'titlePractice' : 'titleTest'}`)}
      </StyledTitleLarge>
      <Instruction
        description={t(`flankerInstructions.${isPracticeRound ? 'practiceDesc' : 'testDesc'}`)}
        name={`${fieldName}.items.${
          isPracticeRound ? FlankerInstructionPositions.Practice : FlankerInstructionPositions.Test
        }.question`}
        title={t(isPracticeRound ? 'practiceInstruction' : 'testInstruction')}
        hasError={isPracticeRound ? hasPracticeInstructionError : hasTestInstructionError}
      />
      <BlockSequences isPracticeRound={isPracticeRound} />
      <RoundOptions isPracticeRound={isPracticeRound} />
    </>
  );
};
