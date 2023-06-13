import { useState, useEffect } from 'react';
import { useNavigate, useParams, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { page } from 'resources';
import { useBreadcrumbs } from 'shared/hooks';

import { LeftBar } from './LeftBar';
import { ActivitySettingsContainer } from './ActivitySettingsContainer';
import { ScoresAndReports } from './ScoresAndReports';
import { SubscalesConfiguration } from './SubscalesConfiguration';
import { ActivitySettingsOptionsItems } from './ActivitySettings.types';
import { StyledWrapper } from './ActivitySettings.styles';
import { ActivitySettingsOptions } from './ActivitySettings.types';
import { getSetting } from './ActivitySettings.utils';

export const ActivitySettings = () => {
  const [activeSetting, setActiveSetting] = useState<ActivitySettingsOptions | null>(null);

  const { t } = useTranslation('app');

  const navigate = useNavigate();
  const { appletId, activityId, setting } = useParams();

  useEffect(() => {
    setActiveSetting(getSetting(setting));
  }, [setting]);

  useBreadcrumbs();

  const handleSetActiveSetting = (setting: ActivitySettingsOptions) => {
    setActiveSetting(setting);
    navigate(
      generatePath(page.builderAppletActivitySettingsItem, {
        appletId,
        activityId,
        setting: setting.path,
      }),
    );
  };

  const handleClose = () => {
    setActiveSetting(null);
    navigate(generatePath(page.builderAppletActivitySettings, { appletId, activityId }));
  };

  const containerTitle = activeSetting ? t(activeSetting.name) : '';

  return (
    <StyledWrapper>
      <LeftBar
        setting={activeSetting}
        isCompact={!!activeSetting}
        onSettingClick={handleSetActiveSetting}
      />
      <ActivitySettingsContainer title={containerTitle} onClose={handleClose}>
        {activeSetting?.name === ActivitySettingsOptionsItems.ScoresAndReports && (
          <ScoresAndReports />
        )}
        {activeSetting?.name === ActivitySettingsOptionsItems.SubscalesConfiguration && (
          <SubscalesConfiguration />
        )}
      </ActivitySettingsContainer>
    </StyledWrapper>
  );
};
