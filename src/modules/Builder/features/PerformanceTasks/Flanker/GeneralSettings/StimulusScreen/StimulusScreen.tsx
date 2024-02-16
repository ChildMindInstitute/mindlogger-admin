import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { FlankerItemPositions } from 'modules/Builder/types';

import { StimulusContent } from './StimulusContent';

export const StimulusScreen = () => {
  const { t } = useTranslation();
  const { activityObjField } = useCurrentActivity();
  const {
    formState: { errors },
  } = useCustomFormContext();

  const error = get(
    errors,
    `${activityObjField}.items[${FlankerItemPositions.PracticeFirst}].config.stimulusTrials`,
  );

  return (
    <ToggleItemContainer
      errorMessage={error ? 'fillInAllRequired' : null}
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('flankerStimulus.title')}
      Content={StimulusContent}
      tooltip={t('flankerStimulus.tooltip')}
      headerToggling
      data-testid="builder-activity-flanker-stimulus-screen"
    />
  );
};
