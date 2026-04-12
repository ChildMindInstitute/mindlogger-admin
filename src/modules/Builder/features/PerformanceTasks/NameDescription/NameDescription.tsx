import { useTranslation } from 'react-i18next';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';

import { NameDescriptionContent } from './NameDescriptionContent';
import { NameDescriptionProps } from './NameDescription.types';

export const NameDescription = ({ 'data-testid': dataTestid }: NameDescriptionProps) => {
  const { t } = useTranslation();

  return (
    <ToggleItemContainer
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('nameAndDescription')}
      Content={NameDescriptionContent}
      contentProps={{ 'data-testid': dataTestid }}
      headerToggling
      data-testid={`${dataTestid}-common`}
    />
  );
};
