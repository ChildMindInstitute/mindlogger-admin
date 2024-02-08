import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { useRedirectIfNoMatchedActivityFlow } from 'modules/Builder/hooks';
import { page } from 'resources';
import { NavigationItem, NavigationMenu } from 'shared/components';

import { useActivityFlow } from './ActivityFlowSettings.hooks';
import { getSettings } from './ActivityFlowSettings.utils';

export const ActivityFlowSettings = () => {
  const navigate = useNavigate();
  const { appletId, activityFlowId } = useParams();
  const activityFlow = useActivityFlow();

  useRedirectIfNoMatchedActivityFlow();

  const handleItemClose = () => {
    navigate(generatePath(page.builderAppletActivityFlowItemSettings, { appletId, activityFlowId }));
  };
  const handleSetActiveItem = (setting: NavigationItem) => {
    navigate(
      generatePath(page.builderAppletActivityFlowItemSettingsItem, {
        appletId,
        activityFlowId,
        setting: setting.param,
      }),
    );
    setting.onClick?.();
  };

  return (
    <NavigationMenu
      title="activityFlowSettings"
      items={getSettings(activityFlow)}
      onClose={handleItemClose}
      onSetActiveItem={handleSetActiveItem}
    />
  );
};
