import { ActivitySettingsOptions } from '../ActivitySettings.types';

export type LeftBarProps = {
  setting: ActivitySettingsOptions | null;
  onSettingClick: (val: ActivitySettingsOptions) => void;
};
