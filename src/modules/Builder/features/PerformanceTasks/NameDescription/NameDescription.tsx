import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';

import { NameDescriptionContent } from './NameDescriptionContent';
import { NameDescriptionProps } from './NameDescription.types';

export const NameDescription = ({ 'data-testid': dataTestid }: NameDescriptionProps) => {
  const { t } = useTranslation();

  const contentProps = useMemo(() => ({ 'data-testid': dataTestid }), [dataTestid]);

  return (
    <ToggleItemContainer
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('nameAndDescription')}
      Content={NameDescriptionContent}
      contentProps={contentProps}
      headerToggling
      data-testid={`${dataTestid}-common`}
    />
  );
};
