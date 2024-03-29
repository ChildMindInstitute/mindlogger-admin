import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { LeftBar } from './LeftBar';
import { Container } from './Container';
import { StyledWrapper } from './NavigationMenu.styles';
import { NavigationMenuProps } from './NavigationMenu.types';
import { getActiveItem } from './NavigationMenu.utils';
import { useSettingsRedirection } from './NavigationMenu.hooks';

export const NavigationMenu = ({
  title,
  items,
  onClose,
  onSetActiveItem,
  'data-testid': dataTestid,
}: NavigationMenuProps) => {
  const { setting } = useParams();
  const { t } = useTranslation('app');

  const activeItem = getActiveItem(items, setting);
  const hasActiveItem = !!activeItem && !activeItem?.disabled;

  useSettingsRedirection(items);

  return (
    <StyledWrapper data-testid={dataTestid}>
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
