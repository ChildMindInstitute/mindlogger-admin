import { AppletSetting, NavigationSetting } from '../AppletSettings.types';

export type NavigationProps = {
  settings: NavigationSetting[];
  selectedSetting: AppletSetting | null;
  handleSettingClick: (setting: AppletSetting) => void;
};
