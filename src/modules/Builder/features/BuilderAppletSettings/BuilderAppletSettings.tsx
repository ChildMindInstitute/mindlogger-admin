import { useLocation } from 'react-router-dom';

import { AppletSettings } from 'shared/features/AppletSettings';
import { page } from 'resources';

import { getSettings } from './BuilderAppletSettings.const';

export const BuilderAppletSettings = () => {
  const location = useLocation();
  const isEditAppletPage = location.pathname.includes(page.newApplet);

  return <AppletSettings settings={getSettings(isEditAppletPage)} />;
};
