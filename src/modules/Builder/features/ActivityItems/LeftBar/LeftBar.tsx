import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { Svg } from 'shared/components';
import { StyledTitleMedium, theme } from 'shared/styles';
import { useHeaderSticky } from 'shared/hooks';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';

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

  const { name } = useCurrentActivity();

  return (
    <StyledBar hasActiveItem={!!activeItemId} ref={containerRef}>
      <StyledHeader isSticky={isHeaderSticky}>{t('items')}</StyledHeader>
      <StyledContent>
        {items?.length ? (
          items?.map((item, index) => (
            <Item
              item={item}
              name={`${name}.items[${index}]`}
              key={`item-${item.id ?? item.key}`}
              activeItemId={activeItemId}
              onSetActiveItem={onSetActiveItem}
              onRemoveItem={onRemoveItem}
            />
          ))
        ) : (
          <StyledTitleMedium sx={{ margin: theme.spacing(1.6, 4, 2.4) }}>
            {t('itemIsRequired')}
          </StyledTitleMedium>
        )}
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
