import { useTranslation } from 'react-i18next';

import { StyledFlexTopCenter } from 'shared/styles/styledComponents';

import { StyledCol, StyledItem, StyledActiveTitle, StyledInactiveTitle } from './Item.styles';
import { ItemProps } from './Item.types';

export const Item = ({ name, icon, activeSetting, setActiveSetting }: ItemProps) => {
  const { t } = useTranslation('app');

  const isActive = activeSetting === name;

  const handleClick = () => setActiveSetting(name);

  const TitleC = isActive ? StyledActiveTitle : StyledInactiveTitle;

  return (
    <StyledItem isActive={isActive} onClick={handleClick}>
      <StyledFlexTopCenter>{icon}</StyledFlexTopCenter>
      <StyledCol>
        <TitleC>{t(name)}</TitleC>
      </StyledCol>
    </StyledItem>
  );
};
