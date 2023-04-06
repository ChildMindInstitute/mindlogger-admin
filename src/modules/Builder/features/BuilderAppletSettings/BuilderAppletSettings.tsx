import { useLocation } from 'react-router-dom';

import { AppletSettings } from 'shared/features/AppletSettings';
import { Path } from 'shared/utils';

import { getSettings } from './BuilderAppletSettings.const';

export const BuilderAppletSettings = () => {
  const location = useLocation();
  const isEditAppletPage = !location.pathname.includes(Path.NewApplet);

  return <AppletSettings isBuilder settings={getSettings(isEditAppletPage)} />;
};
