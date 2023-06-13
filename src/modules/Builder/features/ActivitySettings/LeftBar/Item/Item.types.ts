import { ActivitySettingsOptions } from '../../ActivitySettings.types';

export type ItemProps = {
  item: ActivitySettingsOptions;
  isCompact: boolean;
  onClick: (item: ActivitySettingsOptions) => void;
};
