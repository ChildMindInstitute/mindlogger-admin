import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useHeaderSticky } from 'shared/hooks';
import { StyledBodyMedium } from 'shared/styles';

import { getSettings } from '../ActivitySettings.utils';
import { StyledBar, StyledHeader, StyledContent, StyledGroupContainer } from './LeftBar.styles';
import { LeftBarProps } from './LeftBar.types';
import { Item } from './Item';

export const LeftBar = ({ setting, onSettingClick }: LeftBarProps) => {
  const { t } = useTranslation('app');
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);

  const items = getSettings();

  return (
    <StyledBar ref={containerRef} hasSetting={!!setting}>
      <StyledHeader isSticky={isHeaderSticky}>{t('activitySettings')}</StyledHeader>
      <StyledContent>
        {items.map(({ label, items }) => (
          <StyledGroupContainer key={`group-${label}`}>
            <StyledBodyMedium>{t(label)}</StyledBodyMedium>
            {items?.map((item) => (
              <Item key={`left-bar-item-${item.name}`} item={item} onClick={onSettingClick} />
            ))}
          </StyledGroupContainer>
        ))}
      </StyledContent>
    </StyledBar>
  );
};
