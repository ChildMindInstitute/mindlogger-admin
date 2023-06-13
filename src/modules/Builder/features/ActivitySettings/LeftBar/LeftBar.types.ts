import { ActivitySettingsOptions } from '../ActivitySettings.types';

export type LeftBarProps = {
  setting: ActivitySettingsOptions | null;
  isCompact: boolean;
  onSettingClick: (val: ActivitySettingsOptions) => void;
};
