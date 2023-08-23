import { useNavigate, useParams, generatePath } from 'react-router-dom';

import { page } from 'resources';
import { useBreadcrumbs } from 'shared/hooks';
import { useActivitiesRedirection, useCurrentActivity } from 'modules/Builder/hooks';
import { NavigationItem, NavigationMenu } from 'shared/components';
import { getEntityKey } from 'shared/utils';

import { getSettings } from './ActivitySettings.utils';

export const ActivitySettings = () => {
  const { fieldName, activity } = useCurrentActivity();
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
      title="activitySettings"
      items={getSettings(fieldName, activity)}
      onClose={handleClose}
      onSetActiveItem={handleSetActiveSetting}
    />
  );
};
