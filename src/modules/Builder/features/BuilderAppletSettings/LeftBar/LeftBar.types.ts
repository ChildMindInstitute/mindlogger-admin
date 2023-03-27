import { ActivitySettings } from '../BuilderAppletSettings.const';

export type LeftBarProps = {
  setActiveSetting: (val: ActivitySettings) => void;
  activeSetting: string;
};
