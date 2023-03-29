import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { Svg } from 'shared/components';
import { useHeaderSticky } from 'shared/hooks';

import { StyledBar, StyledHeader, StyledContent, StyledBtnWrapper } from './LeftBar.styles';
import { LeftBarProps } from './LeftBar.types';
import { Item } from './Item';

export const LeftBar = ({
  items,
  activeItemId,
  onSetActiveItem,
  onAddItem,
  onRemoveItem,
}: LeftBarProps) => {
  const { t } = useTranslation('app');
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);

  return (
    <StyledBar ref={containerRef}>
      <StyledHeader isSticky={isHeaderSticky}>{t('items')}</StyledHeader>
      <StyledContent>
        {items.map((item) => (
          <Item
            key={item.id}
            {...item}
            activeItemId={activeItemId}
            onSetActiveItem={onSetActiveItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
        <StyledBtnWrapper>
          <Button
            variant="outlined"
            startIcon={<Svg id="add" width={18} height={18} />}
            onClick={onAddItem}
          >
            {t('addItem')}
          </Button>
        </StyledBtnWrapper>
      </StyledContent>
    </StyledBar>
  );
};
