import { ActivitySettingsOptions } from '../../ActivitySettings.types';

export type ItemProps = {
  item: ActivitySettingsOptions;
  onClick: (item: ActivitySettingsOptions) => void;
};
