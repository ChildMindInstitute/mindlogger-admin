import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useHeaderSticky } from 'shared/hooks';
import { StyledTitleSmall } from 'shared/styles';
import { Tooltip } from 'shared/components';

import {
  StyledBar,
  StyledHeader,
  StyledContent,
  StyledSettingsGroup,
  StyledSettings,
  StyledSetting,
  StyledTitle,
} from './LeftBar.styles';
import { LeftBarProps } from './LeftBar.types';

export const LeftBar = ({ title, items, activeItem, isCompact, onItemClick }: LeftBarProps) => {
  const { t } = useTranslation('app');
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);

  return (
    <StyledBar ref={containerRef} hasItem={!!activeItem}>
      <StyledHeader isSticky={isHeaderSticky}>{t(title)}</StyledHeader>
      <StyledContent isCompact={isCompact}>
        {items.map(({ label, items }) => (
          <StyledSettingsGroup key={label} isCompact={!!activeItem}>
            <StyledTitleSmall>{t(label)}</StyledTitleSmall>
            <StyledSettings isCompact={!!activeItem}>
              {items.map(({ icon, label, component, param, disabled, tooltip }) => (
                <Tooltip tooltipTitle={tooltip ? t(tooltip) : null} key={`item-setting-${label}`}>
                  <span>
                    <StyledSetting
                      onClick={() =>
                        onItemClick({ label, component, param, icon, disabled, tooltip })
                      }
                      isCompact={!!activeItem}
                      isSelected={activeItem?.label === label}
                      disabled={disabled}
                    >
                      {icon}
                      <StyledTitle>{t(label)}</StyledTitle>
                    </StyledSetting>
                  </span>
                </Tooltip>
              ))}
            </StyledSettings>
          </StyledSettingsGroup>
        ))}
      </StyledContent>
    </StyledBar>
  );
};
