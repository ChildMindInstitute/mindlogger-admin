import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { useBreadcrumbs } from 'hooks';

import { Navigation } from './Navigation';
import { Setting } from './Setting';
import { StyledContainer } from './AppletSettings.styles';
import { AppletSetting } from './AppletSettings.types';

export const AppletSettings = () => {
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
        selectedSetting={selectedSetting}
        handleSettingClick={(setting) => setSelectedSetting(setting)}
      />
      <Setting onClose={() => setSelectedSetting(null)}>{selectedSetting?.component}</Setting>
    </StyledContainer>
  );
};
