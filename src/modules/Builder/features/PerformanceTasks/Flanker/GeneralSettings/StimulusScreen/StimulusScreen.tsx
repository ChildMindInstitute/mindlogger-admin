import { useTranslation } from 'react-i18next';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';

import { StimulusContent } from './StimulusContent';

export const StimulusScreen = () => {
  const { t } = useTranslation();

  return (
    <ToggleItemContainer
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('flankerStimulus.title')}
      Content={StimulusContent}
      tooltip={t('flankerStimulus.tooltip')}
    />
  );
};
