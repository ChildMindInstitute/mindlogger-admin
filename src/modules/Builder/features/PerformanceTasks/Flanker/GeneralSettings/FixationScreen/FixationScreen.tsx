import { useTranslation } from 'react-i18next';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';

import { FixationContent } from './FixationContent';

export const FixationScreen = () => {
  const { t } = useTranslation();

  return (
    <ToggleItemContainer
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('flankerFixation.title')}
      Content={FixationContent}
      tooltip={t('flankerFixation.tooltip')}
    />
  );
};
