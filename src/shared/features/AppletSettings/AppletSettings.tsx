import { useEffect, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'shared/hooks';
import { page } from 'resources';
import { StyledContainer } from 'shared/styles';

import { Navigation } from './Navigation';
import { Setting } from './Setting';
import { AppletSetting, AppletSettingsProps } from './AppletSettings.types';
import { getSettingItem } from './AppletSettings.utils';

export const AppletSettings = ({ settings, isBuilder = false }: AppletSettingsProps) => {
  const { t } = useTranslation('app');
  const { appletId, settingItem } = useParams();
  const navigate = useNavigate();
  const [selectedSetting, setSelectedSetting] = useState<AppletSetting | null>(null);
  const BUILDER_SETTINGS = generatePath(page.builderAppletSettings, {
    appletId,
  });
  const DASHBOARD_SETTINGS = generatePath(page.appletSettings, {
    appletId,
  });

  useBreadcrumbs([
    {
      icon: 'settings',
      label: t('appletSettings'),
    },
  ]);

  useEffect(() => {
    if (!settingItem) {
      return setSelectedSetting(null);
    }
    const setting = getSettingItem(settings, settingItem);

    if (setting && !setting.disabled) return setSelectedSetting(setting);

    if (isBuilder) navigateTo();
  }, [appletId, settingItem]);

  const handleSettingClick = (setting: AppletSetting) => {
    navigateTo(setting.param);
  };

  const navigateTo = (param = '') => {
    if (!isBuilder) {
      return navigate(param ? `${DASHBOARD_SETTINGS}/${param}` : DASHBOARD_SETTINGS);
    }
    navigate(param ? `${BUILDER_SETTINGS}/${param}` : BUILDER_SETTINGS);
  };

  return (
    <StyledContainer>
      <Navigation
        settings={settings}
        selectedSetting={selectedSetting}
        handleSettingClick={handleSettingClick}
      />
      <Setting onClose={navigateTo}>{selectedSetting?.component}</Setting>
    </StyledContainer>
  );
};
