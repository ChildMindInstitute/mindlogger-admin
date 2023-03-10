import { useTranslation } from 'react-i18next';

import { Svg } from 'components';

import { ItemOptionContainer } from '../ItemOptionContainer';
import { StyledColumn, StyledResponseButton } from '../InputTypeItems.styles';

export const VideoResponse = () => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer
      title={t('videoResponseTitle')}
      description={t('videoResponseDescription')}
    >
      <StyledColumn sx={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <StyledResponseButton disabled startIcon={<Svg id="video" width={18} height={18} />}>
          {t('video')}
        </StyledResponseButton>
      </StyledColumn>
    </ItemOptionContainer>
  );
};
