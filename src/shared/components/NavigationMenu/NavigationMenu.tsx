import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { LeftBar } from './LeftBar';
import { StyledWrapper } from './NavigationMenu.styles';
import { Container } from './Container';
import { NavigationItem, NavigationMenuProps } from './NavigationMenu.types';
import { getActiveItem } from './NavigationMenu.utils';

export const NavigationMenu = ({ title, items, onClose, onSetActiveItem }: NavigationMenuProps) => {
  const [activeItem, setActiveItem] = useState<NavigationItem | null>(null);
  const { setting } = useParams();

  const { t } = useTranslation('app');

  const handleSetActiveItem = (item: NavigationItem) => {
    setActiveItem(item);
    onSetActiveItem(item);
  };

  const handleClose = () => {
    setActiveItem(null);
    onClose();
  };

  const activeItemFromRoute = getActiveItem(items, setting);

  useEffect(() => {
    if (!activeItemFromRoute) {
      setActiveItem(null);

      return;
    }

    if (!activeItemFromRoute.disabled) return setActiveItem(activeItemFromRoute);
  }, [setting, activeItemFromRoute?.disabled]);

  return (
    <StyledWrapper>
      <LeftBar
        title={title}
        items={items}
        activeItem={activeItem}
        isCompact={!!activeItem}
        onItemClick={handleSetActiveItem}
      />
      <Container title={t(activeItem?.label || '')} onClose={handleClose}>
        {activeItem?.component}
      </Container>
    </StyledWrapper>
  );
};
