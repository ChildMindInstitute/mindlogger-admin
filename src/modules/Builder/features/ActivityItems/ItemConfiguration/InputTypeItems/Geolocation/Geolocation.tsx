import { useTranslation } from 'react-i18next';

import { ItemInfo } from '../ItemInfo';
import { ItemOptionContainer } from '../ItemOptionContainer';

export const Geolocation = () => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer
      title={t('geolocation')}
      description={t('geolocationDescription')}
      data-testid="builder-activity-items-item-configuration-geolocation"
    >
      <ItemInfo svgId="geolocation" textKey="geolocation" />
    </ItemOptionContainer>
  );
};
