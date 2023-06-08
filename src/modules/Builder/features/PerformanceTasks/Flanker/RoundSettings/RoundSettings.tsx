import { useTranslation } from 'react-i18next';

import { StyledTitleLarge, theme } from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';

import { Instruction } from '../../Instruction';
import { SettingsTypeEnum } from '../Flanker.const';
import { RoundOptions } from './RoundOptions';
import { RoundSettingsProps, RoundTypeEnum } from './RoundSettings.types';
import { BlockSequences } from './BlockSequences';

export const RoundSettings = ({ uiType }: RoundSettingsProps) => {
  const { t } = useTranslation();
  const isPracticeRound = uiType === RoundTypeEnum.Practice;
  const { perfTaskItemField } = useCurrentActivity();

  return (
    <>
      <StyledTitleLarge sx={{ p: theme.spacing(1, 0, 2.4) }}>
        {t(`flankerRound.${isPracticeRound ? 'titlePractice' : 'titleTest'}`)}
      </StyledTitleLarge>
      <Instruction
        description={t(
          `performanceTaskInstructions.${
            isPracticeRound ? 'flankerPracticeDesc' : 'flankerTestDesc'
          }`,
        )}
        name={
          isPracticeRound
            ? `${perfTaskItemField}.practice.instruction`
            : `${perfTaskItemField}.test.instruction`
        }
        title={t(isPracticeRound ? 'practiceInstruction' : 'testInstruction')}
        type={isPracticeRound ? SettingsTypeEnum.Practice : SettingsTypeEnum.General}
      />
      <BlockSequences isPracticeRound={isPracticeRound} />
      <RoundOptions isPracticeRound={isPracticeRound} />
    </>
  );
};
