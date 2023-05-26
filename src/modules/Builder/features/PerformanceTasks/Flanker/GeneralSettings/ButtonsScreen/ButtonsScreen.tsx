import { useTranslation } from 'react-i18next';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';

import { ButtonsContent } from './ButtonsContent';

export const ButtonsScreen = () => {
  const { t } = useTranslation();

  return (
    <ToggleItemContainer
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('flankerButtons.title')}
      Content={ButtonsContent}
      tooltip={t('flankerButtons.tooltip')}
    />
  );
};
