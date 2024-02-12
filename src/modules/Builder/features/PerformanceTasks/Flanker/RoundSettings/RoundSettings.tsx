import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { StyledTitleLarge, theme } from 'shared/styles';
import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
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
  } = useCustomFormContext();

  const hasPracticeInstructionError = !!get(
    errors,
    `${activityObjField}.items[${FlankerInstructionPositions.Practice}].question`,
  );
  const hasTestInstructionError = !!get(
    errors,
    `${activityObjField}.items[${FlankerInstructionPositions.Test}].question`,
  );
  const key = isPracticeRound ? FlankerInstructionPositions.Practice : FlankerInstructionPositions.Test;
  const dataTestid = `builder-activity-flanker-${isPracticeRound ? 'practice' : 'test'}-round`;

  return (
    <>
      <StyledTitleLarge sx={{ p: theme.spacing(1, 0, 2.4) }}>
        {t(`flankerRound.${isPracticeRound ? 'titlePractice' : 'titleTest'}`)}
      </StyledTitleLarge>
      <Instruction
        description={t(`flankerInstructions.${isPracticeRound ? 'practiceDesc' : 'testDesc'}`)}
        name={`${fieldName}.items.${key}.question`}
        title={t(isPracticeRound ? 'practiceInstruction' : 'testInstruction')}
        hasError={isPracticeRound ? hasPracticeInstructionError : hasTestInstructionError}
        instructionId={`instruction-${key}`}
        data-testid={`${dataTestid}-instruction`}
      />
      <BlockSequences isPracticeRound={isPracticeRound} data-testid={`${dataTestid}-block-sequences`} />
      <RoundOptions isPracticeRound={isPracticeRound} data-testid={`${dataTestid}-round-options`} />
    </>
  );
};
