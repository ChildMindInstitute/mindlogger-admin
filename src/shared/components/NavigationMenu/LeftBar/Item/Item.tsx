import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { StyledItem, StyledTitle } from './Item.styles';
import { ItemProps } from './Item.types';

export const Item = ({ item, isCompact, onClick }: ItemProps) => {
  const { t } = useTranslation('app');
  const { setting } = useParams();

  const isActive = setting === item.param;

  return (
    <StyledItem isActive={isActive} isCompact={isCompact} onClick={() => onClick(item)}>
      {item.icon}
      <StyledTitle isActive={isActive}>{t(item.label)}</StyledTitle>
    </StyledItem>
  );
};
