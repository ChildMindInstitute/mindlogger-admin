import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'shared/hooks';
import { page } from 'resources';
import { APPLET_PAGES } from 'shared/consts';
import { StyledContainer } from 'shared/styles';

import { Navigation } from './Navigation';
import { Setting } from './Setting';
import { AppletSetting, AppletSettingsProps } from './AppletSettings.types';
import { getSettingItem } from './AppletSettings.utils';

export const AppletSettings = ({ settings, isBuilder = false }: AppletSettingsProps) => {
  const { t } = useTranslation('app');
  const { id, settingItem } = useParams();
  const navigate = useNavigate();
  const [selectedSetting, setSelectedSetting] = useState<AppletSetting | null>(null);

  const BUILDER_SETTINGS = page.builderAppletSettings;
  const DASHBOARD_SETTINGS = `${page.dashboard}/${id}/${APPLET_PAGES.settings}`;

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
    setting && setSelectedSetting(setting);
  }, [id, settingItem]);

  const handleSettingClick = (setting: AppletSetting) => {
    navigateTo(setting.param);
  };

  const handleOnClose = () => {
    setSelectedSetting(null);
    navigateTo();
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
      <Setting onClose={handleOnClose}>{selectedSetting?.component}</Setting>
    </StyledContainer>
  );
};
