import { NavigationSetting } from './AppletSettings.types';

export const getSettingItem = (settings: NavigationSetting[], param: string) =>
  settings.flatMap((setting) => setting.items).find((setting) => setting.param === param);
