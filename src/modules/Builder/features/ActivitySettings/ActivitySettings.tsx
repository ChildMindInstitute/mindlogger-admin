import { useNavigate, useParams, generatePath } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import { page } from 'resources';
import { useRedirectIfNoMatchedActivity, useCurrentActivity } from 'modules/Builder/hooks';
import { NavigationItem, NavigationMenu } from 'shared/components';

import { getActivitySettings } from './ActivitySettings.utils';

export const ActivitySettings = () => {
  const { fieldName, activity } = useCurrentActivity();
  const { appletId, activityId } = useParams();
  const { getFieldState } = useFormContext();

  const navigate = useNavigate();

  const settingsErrors = {
    hasActivitySubscalesErrors: !!getFieldState(`${fieldName}.subscaleSetting`).error,
    hasActivityReportsErrors: !!getFieldState(`${fieldName}.scoresAndReports`).error,
  };

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
      items={getActivitySettings({ activityFieldName: fieldName, activity, settingsErrors })}
      onClose={handleClose}
      onSetActiveItem={handleSetActiveSetting}
    />
  );
};
