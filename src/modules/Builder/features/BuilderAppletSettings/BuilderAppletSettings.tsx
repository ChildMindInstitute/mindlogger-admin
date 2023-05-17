import { useFormContext } from 'react-hook-form';

import { useCheckIfNewApplet } from 'shared/hooks';
import { AppletSettings } from 'shared/features/AppletSettings';

import { getSettings } from './BuilderAppletSettings.utils';

export const BuilderAppletSettings = () => {
  const isNewApplet = useCheckIfNewApplet();
  const { watch } = useFormContext();

  const isPublished = watch('isPublished');

  return <AppletSettings isBuilder settings={getSettings({ isNewApplet, isPublished })} />;
};
