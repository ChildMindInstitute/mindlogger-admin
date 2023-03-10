import { useTranslation } from 'react-i18next';

import { Svg } from 'components';

import { ItemOptionContainer } from '../ItemOptionContainer';
import { StyledColumn, StyledResponseButton } from '../InputTypeItems.styles';

export const PhotoResponse = () => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer
      title={t('photoResponseTitle')}
      description={t('photoResponseDescription')}
    >
      <StyledColumn sx={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <StyledResponseButton disabled startIcon={<Svg id="photo" width={18} height={18} />}>
          {t('photo')}
        </StyledResponseButton>
      </StyledColumn>
    </ItemOptionContainer>
  );
};
