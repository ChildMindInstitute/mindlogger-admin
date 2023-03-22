import { NavigationSetting } from './AppletSettings.types';

export const getSettingItem = (settings: NavigationSetting[], param: string) =>
  settings
    .map((setting) => setting.items)
    .flat()
    .find((setting) => setting.param === param);
