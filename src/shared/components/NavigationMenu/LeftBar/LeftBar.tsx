import { useRef } from 'react';
import { useParams } from 'react-router-dom';
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

export const LeftBar = ({ title, items, hasActiveItem, onItemClick }: LeftBarProps) => {
  const { setting } = useParams();
  const { t } = useTranslation('app');
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);

  return (
    <StyledBar ref={containerRef} hasItem={hasActiveItem}>
      <StyledHeader isSticky={isHeaderSticky}>{t(title)}</StyledHeader>
      <StyledContent isCompact={hasActiveItem}>
        {items.map(
          ({ label, items, visibility = true }) =>
            visibility && (
              <StyledSettingsGroup key={label} isCompact={hasActiveItem}>
                <StyledTitleSmall>{t(label)}</StyledTitleSmall>
                <StyledSettings isCompact={hasActiveItem}>
                  {items.map(
                    ({
                      icon,
                      label,
                      component,
                      param,
                      disabled,
                      tooltip,
                      visibility: itemVisibility = true,
                      'data-testid': dataTestid,
                    }) =>
                      itemVisibility && (
                        <Tooltip
                          tooltipTitle={tooltip ? t(tooltip) : null}
                          key={`item-setting-${label}`}
                        >
                          <span>
                            <StyledSetting
                              onClick={() =>
                                onItemClick({ label, component, param, icon, disabled, tooltip })
                              }
                              isCompact={hasActiveItem}
                              isSelected={!disabled && setting === param}
                              disabled={disabled}
                              data-testid={dataTestid}
                            >
                              {icon}
                              <StyledTitle>{t(label)}</StyledTitle>
                            </StyledSetting>
                          </span>
                        </Tooltip>
                      ),
                  )}
                </StyledSettings>
              </StyledSettingsGroup>
            ),
        )}
      </StyledContent>
    </StyledBar>
  );
};
