import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useHeaderSticky } from 'shared/hooks';
import { StyledBodyMedium } from 'shared/styles';

import {
  StyledBar,
  StyledHeader,
  StyledContent,
  StyledGroupContainer,
  StyledItemsContainer,
} from './LeftBar.styles';
import { LeftBarProps } from './LeftBar.types';
import { Item } from './Item';

export const LeftBar = ({ items, activeItem, isCompact, onItemClick }: LeftBarProps) => {
  const { t } = useTranslation('app');
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);

  return (
    <StyledBar ref={containerRef} hasItem={!!activeItem}>
      <StyledHeader isSticky={isHeaderSticky}>{t('activitySettings')}</StyledHeader>
      <StyledContent isCompact={isCompact}>
        {items.map(({ label, items }) => (
          <StyledGroupContainer key={`group-${label}`} isCompact={isCompact}>
            <StyledBodyMedium>{t(label)}</StyledBodyMedium>
            <StyledItemsContainer isCompact={isCompact}>
              {items?.map((item) => (
                <Item
                  key={`left-bar-item-${item.name}`}
                  item={item}
                  isCompact={isCompact}
                  onClick={onItemClick}
                />
              ))}
            </StyledItemsContainer>
          </StyledGroupContainer>
        ))}
      </StyledContent>
    </StyledBar>
  );
};
