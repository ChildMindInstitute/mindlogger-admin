import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { FlankerStimulusSettings } from 'shared/state';
import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { useCurrentActivity } from 'modules/Builder/hooks';

import { IsPracticeRoundType } from '../RoundSettings.types';
import { BlockSequencesContent } from './BlockSequencesContent';

export const BlockSequences = memo(({ isPracticeRound }: IsPracticeRoundType) => {
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const { perfTaskItemField } = useCurrentActivity();

  const stimulusTrials = watch(`${perfTaskItemField}.general.stimulusTrials`);
  const hasStimulusErrors = !stimulusTrials?.some(
    (trial: FlankerStimulusSettings) => !!trial.image,
  );

  return (
    <ToggleItemContainer
      isOpenDisabled={hasStimulusErrors}
      isOpenByDefault={!hasStimulusErrors}
      error={hasStimulusErrors ? 'flankerRound.addStimulus' : error}
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('flankerRound.blockSequences')}
      Content={BlockSequencesContent}
      contentProps={{ isPracticeRound, setError }}
      tooltip={t('flankerRound.sequencesTooltip')}
    />
  );
});
