import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';

import { StyledText, StyledWrapper } from './ItemInfo.styles';
import { ItemInfoProps } from './ItemInfo.types';

export const ItemInfo = ({ svgId, textKey }: ItemInfoProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledWrapper>
      <Svg id={svgId} />
      <StyledText>{t(textKey)}</StyledText>
    </StyledWrapper>
  );
};
