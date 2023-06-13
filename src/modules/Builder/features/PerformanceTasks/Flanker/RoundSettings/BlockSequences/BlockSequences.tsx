import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { FlankerStimulusSettings } from 'shared/state';
import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { useCurrentActivity } from 'modules/Builder/hooks';

import { IsPracticeRoundType, RoundTypeEnum } from '../RoundSettings.types';
import { BlockSequencesContent } from './BlockSequencesContent';

export const BlockSequences = memo(({ isPracticeRound }: IsPracticeRoundType) => {
  const { t } = useTranslation();
  const {
    watch,
    formState: { errors },
  } = useFormContext();
  const { perfTaskItemField } = useCurrentActivity();

  const stimulusTrials = watch(`${perfTaskItemField}.general.stimulusTrials`);
  const hasError = !stimulusTrials?.some((trial: FlankerStimulusSettings) => !!trial.image);

  return (
    <ToggleItemContainer
      isOpenDisabled={hasError}
      isOpenByDefault={!hasError}
      error={hasError ? t('flankerRound.addStimulus') : ''}
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('flankerRound.blockSequences')}
      Content={() => <BlockSequencesContent isPracticeRound={isPracticeRound} />}
      tooltip={t('flankerRound.sequencesTooltip')}
    />
  );
});
