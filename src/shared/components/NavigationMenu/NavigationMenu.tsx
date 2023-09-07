import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { LeftBar } from './LeftBar';
import { StyledWrapper } from './NavigationMenu.styles';
import { Container } from './Container';
import { NavigationMenuProps } from './NavigationMenu.types';
import { getActiveItem } from './NavigationMenu.utils';

export const NavigationMenu = ({ title, items, onClose, onSetActiveItem }: NavigationMenuProps) => {
  const { setting } = useParams();
  const { t } = useTranslation('app');

  const activeItem = getActiveItem(items, setting);
  const hasActiveItem = !!activeItem && !activeItem?.disabled;

  return (
    <StyledWrapper>
      <LeftBar
        title={title}
        items={items}
        hasActiveItem={hasActiveItem}
        onItemClick={onSetActiveItem}
      />
      {hasActiveItem && (
        <Container title={t(activeItem?.label || '')} onClose={onClose}>
          {activeItem?.component}
        </Container>
      )}
    </StyledWrapper>
  );
};
