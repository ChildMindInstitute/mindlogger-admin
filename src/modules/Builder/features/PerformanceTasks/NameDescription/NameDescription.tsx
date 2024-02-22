import { useTranslation } from 'react-i18next';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';

import { NameDescriptionContent } from './NameDescriptionContent';

export const NameDescription = () => {
  const { t } = useTranslation();

  return (
    <ToggleItemContainer
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('nameAndDescription')}
      Content={NameDescriptionContent}
      headerToggling
      data-testid="builder-activity-flanker-common"
    />
  );
};
