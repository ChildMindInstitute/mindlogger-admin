import { memo } from 'react';

import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { FlankerStimulusSettings } from 'shared/state';
import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { FlankerItemPositions } from 'modules/Builder/types';

import { BlockSequencesContent } from './BlockSequencesContent';
import { BlockSequencesProps } from './BlockSequences.types';

export const BlockSequences = memo(({ isPracticeRound, 'data-testid': dataTestid }: BlockSequencesProps) => {
  const { t } = useTranslation();
  const {
    watch,
    formState: { errors },
  } = useCustomFormContext();
  const { fieldName, activityObjField } = useCurrentActivity();

  const stimulusTrials = watch(`${fieldName}.items.${FlankerItemPositions.PracticeFirst}.config.stimulusTrials`);
  const hasStimulusErrors = !stimulusTrials?.some((trial: FlankerStimulusSettings) => !!trial.image || !!trial.text);

  const blockSequencesObjField = `${activityObjField}.items[${
    isPracticeRound ? FlankerItemPositions.PracticeFirst : FlankerItemPositions.TestFirst
  }].config.blocks`;
  const hasBlockSequencesErrors = !!get(errors, blockSequencesObjField);

  const getError = () => {
    if (hasStimulusErrors) return 'flankerRound.addStimulus';
    if (hasBlockSequencesErrors) return 'fillInAllRequired';

    return null;
  };

  return (
    <ToggleItemContainer
      isOpenDisabled={hasStimulusErrors}
      isOpenByDefault={!hasStimulusErrors}
      errorMessage={getError()}
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('flankerRound.blockSequences')}
      Content={BlockSequencesContent}
      contentProps={{ isPracticeRound, hasBlockSequencesErrors, 'data-testid': dataTestid }}
      tooltip={t('flankerRound.sequencesTooltip')}
      headerToggling
      data-testid={dataTestid}
    />
  );
});
