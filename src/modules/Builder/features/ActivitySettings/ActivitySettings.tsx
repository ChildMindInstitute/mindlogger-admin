import { useNavigate, useParams, generatePath } from 'react-router-dom';

import { page } from 'resources';
import { useBreadcrumbs } from 'shared/hooks';
import { useActivitiesRedirection, useCurrentActivity } from 'modules/Builder/hooks';
import { NavigationMenu } from 'shared/components';
import { NavigationItem } from 'shared/components/NavigationMenu/NavigationMenu.types';

import { getSettings } from './ActivitySettings.utils';

export const ActivitySettings = () => {
  const { fieldName } = useCurrentActivity();
  const { appletId, activityId } = useParams();

  const navigate = useNavigate();

  useBreadcrumbs();
  useActivitiesRedirection();

  const handleSetActiveSetting = (setting: NavigationItem) => {
    navigate(
      generatePath(page.builderAppletActivitySettingsItem, {
        appletId,
        activityId,
        setting: setting.param,
      }),
    );
  };

  const handleClose = () => {
    navigate(generatePath(page.builderAppletActivitySettings, { appletId, activityId }));
  };

  return (
    <NavigationMenu
      items={getSettings(fieldName)}
      onClose={handleClose}
      onSetActiveItem={handleSetActiveSetting}
    />
  );
};
