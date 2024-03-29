import { useTranslation } from 'react-i18next';

import { ToggleItemContainer } from 'modules/Builder/components/ToggleItemContainer';

import { DrawingContent } from './DrawingContent';
import { DrawingHeader } from './DrawingHeader';
import { DrawingProps } from './Drawing.types';

export const Drawing = ({ name }: DrawingProps) => {
  const { t } = useTranslation();

  return (
    <ToggleItemContainer
      title={t('drawing')}
      HeaderContent={DrawingHeader}
      Content={DrawingContent}
      contentProps={{ name }}
      headerContentProps={{ name }}
      data-testid="builder-activity-items-item-configuration-drawing"
    />
  );
};
