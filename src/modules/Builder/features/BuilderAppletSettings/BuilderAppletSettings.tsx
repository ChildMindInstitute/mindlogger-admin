import { useFormContext } from 'react-hook-form';

import { useCheckIfNewApplet } from 'shared/hooks';
import { AppletSettings } from 'shared/features/AppletSettings';
import { workspaces } from 'redux/modules';

import { getSettings } from './BuilderAppletSettings.utils';

export const BuilderAppletSettings = () => {
  const isNewApplet = useCheckIfNewApplet();
  const { watch } = useFormContext();

  const isPublished = watch('isPublished');
  const priorityRoleData = workspaces.usePriorityRoleData();

  return (
    <AppletSettings
      isBuilder
      settings={getSettings({ isNewApplet, isPublished, role: priorityRoleData?.data })}
    />
  );
};
