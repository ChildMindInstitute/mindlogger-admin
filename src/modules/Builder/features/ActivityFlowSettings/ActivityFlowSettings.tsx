import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { NavigationItem, NavigationMenu } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { page } from 'resources';
import { useActivityFlowsRedirection } from 'modules/Builder/hooks';

import { getSettings } from './ActivityFlowSettings.utils';
import { useActivityFlow } from './ActivityFlowSettings.hooks';

export const ActivityFlowSettings = () => {
  const navigate = useNavigate();
  const { appletId, activityFlowId } = useParams();
  const activityFlow = useActivityFlow();

  useBreadcrumbs();
  useActivityFlowsRedirection();

  const handleItemClose = () => {
    navigate(
      generatePath(page.builderAppletActivityFlowItemSettings, { appletId, activityFlowId }),
    );
  };
  const handleSetActiveItem = (setting: NavigationItem) => {
    navigate(
      generatePath(page.builderAppletActivityFlowItemSettingsItem, {
        appletId,
        activityFlowId,
        setting: setting.param,
      }),
    );
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
