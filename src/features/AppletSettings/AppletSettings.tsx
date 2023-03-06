import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components';
import { useBreadcrumbs } from 'hooks';

import { Navigation, Setting } from '../AppletSettings';
import { StyledContainer } from './AppletSettings.styles';
import { AppletSetting, AppletSettingsProps } from './AppletSettings.types';

export const AppletSettings = ({ settings }: AppletSettingsProps) => {
  const { t } = useTranslation('app');
  const [selectedSetting, setSelectedSetting] = useState<AppletSetting | null>(null);

  useBreadcrumbs([
    {
      icon: <Svg id="settings" width="15" height="15" />,
      label: t('appletSettings'),
    },
  ]);

  return (
    <StyledContainer>
      <Navigation
        settings={settings}
        selectedSetting={selectedSetting}
        handleSettingClick={(setting) => setSelectedSetting(setting)}
      />
      <Setting onClose={() => setSelectedSetting(null)}>{selectedSetting?.component}</Setting>
    </StyledContainer>
  );
};
