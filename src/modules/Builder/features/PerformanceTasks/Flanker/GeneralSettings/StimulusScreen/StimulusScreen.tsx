import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { useCurrentActivity } from 'modules/Builder/hooks';

import { StimulusContent } from './StimulusContent';

export const StimulusScreen = () => {
  const { t } = useTranslation();
  const { perfTaskItemObjField } = useCurrentActivity();
  const {
    formState: { errors },
  } = useFormContext();

  const error = get(errors, `${perfTaskItemObjField}.general.stimulusTrials`);

  return (
    <ToggleItemContainer
      error={error ? t('fillInAllRequired') : undefined}
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('flankerStimulus.title')}
      Content={StimulusContent}
      tooltip={t('flankerStimulus.tooltip')}
    />
  );
};
