import { useCheckIfNewApplet } from 'shared/hooks';
import { AppletSettings } from 'shared/features/AppletSettings';

import { getSettings } from './BuilderAppletSettings.const';

export const BuilderAppletSettings = () => {
  const isNewApplet = useCheckIfNewApplet();

  return <AppletSettings isBuilder settings={getSettings(isNewApplet)} />;
};
