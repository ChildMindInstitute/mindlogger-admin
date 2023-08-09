import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { NavigationMenu } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { page } from 'resources';
import { useActivityFlowsRedirection } from 'modules/Builder/hooks';
import { NavigationItem } from 'shared/components/NavigationMenu/NavigationMenu.types';

import { getSettings } from './ActivityFlowSettings.utils';

export const ActivityFlowSettings = () => {
  const navigate = useNavigate();
  const { appletId, activityFlowId } = useParams();

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
      items={getSettings()}
      onClose={handleItemClose}
      onSetActiveItem={handleSetActiveItem}
    />
  );
};
