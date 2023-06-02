import { useTranslation } from 'react-i18next';

import { StyledTitleLarge, theme } from 'shared/styles';

import { OverviewInstruction, OverviewInstructionType } from '../../OverviewInstruction';
import { RoundOptions } from './RoundOptions';
import { RoundSettingsProps, RoundTypeEnum } from './RoundSettings.types';
import { BlockSequences } from './BlockSequences';

export const RoundSettings = ({ uiType }: RoundSettingsProps) => {
  const { t } = useTranslation();
  const isPracticeRound = uiType === RoundTypeEnum.Practice;

  return (
    <>
      <StyledTitleLarge sx={{ p: theme.spacing(1, 0, 2.4) }}>
        {t(`flankerRound.${isPracticeRound ? 'titlePractice' : 'titleTest'}`)}
      </StyledTitleLarge>
      <OverviewInstruction
        instructionType={
          isPracticeRound
            ? OverviewInstructionType.FlankerPractice
            : OverviewInstructionType.FlankerTest
        }
        description={t(
          `performanceTaskInstructions.${
            isPracticeRound ? 'flankerPracticeDesc' : 'flankerTestDesc'
          }`,
        )}
      />
      <BlockSequences isPracticeRound={isPracticeRound} />
      <RoundOptions isPracticeRound={isPracticeRound} />
    </>
  );
};
