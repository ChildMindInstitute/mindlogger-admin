import { useNavigate, useParams, generatePath } from 'react-router-dom';

import { page } from 'resources';
import { useRedirectIfNoMatchedActivity, useCurrentActivity } from 'modules/Builder/hooks';
import { NavigationItem, NavigationMenu } from 'shared/components';

import { getSettings } from './ActivitySettings.utils';

export const ActivitySettings = () => {
  const { fieldName, activity } = useCurrentActivity();
  const { appletId, activityId } = useParams();

  const navigate = useNavigate();

  useRedirectIfNoMatchedActivity();

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
