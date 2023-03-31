import { useParams } from 'react-router-dom';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';

import { StyledCol, StyledItem, StyledTitle } from './Item.styles';
import { ItemProps } from './Item.types';

export const Item = ({ item, onClick }: ItemProps) => {
  const { setting } = useParams();

  const isActive = setting === item.path;

  return (
    <StyledItem isActive={isActive} onClick={() => onClick(item)}>
      <StyledFlexTopCenter>{item.icon}</StyledFlexTopCenter>
      <StyledCol>
        <StyledTitle isActive={isActive}>{item.title}</StyledTitle>
      </StyledCol>
    </StyledItem>
  );
};
