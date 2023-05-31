import { useFormContext } from 'react-hook-form';

import { useCheckIfNewApplet } from 'shared/hooks';
import { AppletSettings } from 'shared/features/AppletSettings';
import { workspaces, applet } from 'redux/modules';

import { getSettings } from './BuilderAppletSettings.utils';

export const BuilderAppletSettings = () => {
  const isNewApplet = useCheckIfNewApplet();
  const { watch } = useFormContext();

  const isPublished = watch('isPublished');
  const workspaceRoles = workspaces.useRolesData();
  const { result: appletData } = applet.useAppletData() ?? {};

  return (
    <AppletSettings
      isBuilder
      settings={getSettings({
        isNewApplet,
        isPublished,
        roles: appletData?.id ? workspaceRoles?.data?.[appletData.id] : undefined,
      })}
    />
  );
};
