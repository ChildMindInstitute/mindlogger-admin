import { useTranslation } from 'react-i18next';

import { StyledTitleSmall } from 'shared/styles';
import { Tooltip } from 'shared/components';

import {
  StyledSetting,
  StyledSettings,
  StyledContainer,
  StyledHeadline,
  StyledSettingsGroup,
  StyledTitle,
} from './Navigation.styles';
import { NavigationProps } from './Navigation.types';

export const Navigation = ({ settings, selectedSetting, handleSettingClick }: NavigationProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledContainer>
      <StyledHeadline>{t('appletSettings')}</StyledHeadline>
      {settings.map(({ label, items }) => (
        <StyledSettingsGroup key={label} isCompact={!!selectedSetting}>
          <StyledTitleSmall>{t(label)}</StyledTitleSmall>
          <StyledSettings isCompact={!!selectedSetting}>
            {items.map(({ icon, label, component, param, disabled, tooltip }) => (
              <Tooltip tooltipTitle={tooltip ? tooltip : null} key={`item-setting-${label}`}>
                <span>
                  <StyledSetting
                    onClick={() => handleSettingClick({ label, component, param })}
                    isCompact={!!selectedSetting}
                    isSelected={selectedSetting?.label === label}
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
    </StyledContainer>
  );
};
