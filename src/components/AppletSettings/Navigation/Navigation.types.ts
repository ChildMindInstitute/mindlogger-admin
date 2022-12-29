import { AppletSetting } from '../AppletSettings.types';

export type NavigationProps = {
  selectedSetting: AppletSetting | null;
  handleSettingClick: (setting: AppletSetting) => void;
};
