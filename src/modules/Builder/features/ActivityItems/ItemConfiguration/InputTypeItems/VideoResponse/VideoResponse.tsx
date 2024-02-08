import { useTranslation } from 'react-i18next';

import { ItemInfo } from '../ItemInfo';
import { ItemOptionContainer } from '../ItemOptionContainer';

export const VideoResponse = () => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer
      title={t('videoResponseTitle')}
      description={t('videoResponseDescription')}
      data-testid="builder-activity-items-item-configuration-video">
      <ItemInfo svgId="video" textKey="video" />
    </ItemOptionContainer>
  );
};
