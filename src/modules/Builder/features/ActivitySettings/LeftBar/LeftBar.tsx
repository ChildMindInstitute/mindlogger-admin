import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useHeaderSticky } from 'shared/hooks';
import { StyledBodyMedium } from 'shared/styles';

import { items } from './LeftBar.const';
import { StyledBar, StyledHeader, StyledContent, StyledGroupContainer } from './LeftBar.styles';
import { LeftBarProps } from './LeftBar.types';
import { Item } from './Item';

export const LeftBar = ({ activeSetting, setActiveSetting }: LeftBarProps) => {
  const { t } = useTranslation('app');
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);

  return (
    <StyledBar ref={containerRef}>
      <StyledHeader isSticky={isHeaderSticky}>{t('activitySettings')}</StyledHeader>
      <StyledContent>
        {items.map(({ groupName, groupItems }) => (
          <StyledGroupContainer key={`group-${groupName}`}>
            <StyledBodyMedium>{t(groupName)}</StyledBodyMedium>
            {groupItems?.map((item) => (
              <Item
                key={`left-bar-item-${item.name}`}
                {...item}
                activeSetting={activeSetting}
                setActiveSetting={setActiveSetting}
              />
            ))}
          </StyledGroupContainer>
        ))}
      </StyledContent>
    </StyledBar>
  );
};
