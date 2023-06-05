import { useTranslation } from 'react-i18next';

import { StyledTitleLarge, theme } from 'shared/styles';

import { Instruction } from '../../Instruction';
import { RoundOptions } from './RoundOptions';
import { RoundSettingsProps, RoundUiType } from './RoundSettings.types';
import { BlockSequences } from './BlockSequences';

export const RoundSettings = ({ uiType }: RoundSettingsProps) => {
  const { t } = useTranslation();
  const isPracticeRound = uiType === RoundUiType.Practice;

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
      />
      <BlockSequences isPracticeRound={isPracticeRound} />
      <RoundOptions isPracticeRound={isPracticeRound} />
    </>
  );
};
