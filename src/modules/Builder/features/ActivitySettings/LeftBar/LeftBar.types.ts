import { ActivitySettingsOptions } from '../ActivitySettings.const';

export type LeftBarProps = {
  setActiveSetting: (val: ActivitySettingsOptions) => void;
  activeSetting: string;
};
