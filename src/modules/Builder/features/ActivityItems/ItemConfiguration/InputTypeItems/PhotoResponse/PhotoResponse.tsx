import { useTranslation } from 'react-i18next';

import { ItemInfo } from '../ItemInfo';
import { ItemOptionContainer } from '../ItemOptionContainer';

export const PhotoResponse = () => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer
      title={t('photoResponseTitle')}
      description={t('photoResponseDescription')}
      data-testid="builder-activity-items-item-configuration-photo"
    >
      <ItemInfo svgId="camera-outline" textKey="photo" />
    </ItemOptionContainer>
  );
};
