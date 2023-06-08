import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';

import { IsPracticeRoundType } from '../RoundSettings.types';
import { BlockSequencesContent } from './BlockSequencesContent';

export const BlockSequences = memo(({ isPracticeRound }: IsPracticeRoundType) => {
  const { t } = useTranslation();

  return (
    <ToggleItemContainer
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('flankerRound.blockSequences')}
      Content={() => <BlockSequencesContent isPracticeRound={isPracticeRound} />}
      tooltip={t('flankerRound.sequencesTooltip')}
    />
  );
});
