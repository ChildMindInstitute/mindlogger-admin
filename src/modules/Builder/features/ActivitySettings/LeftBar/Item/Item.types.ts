import { LeftBarProps } from '../LeftBar.types';
import { ActivitySettingsOptions } from '../../ActivitySettings.const';

export type ItemProps = {
  name: ActivitySettingsOptions;
  icon: JSX.Element;
} & LeftBarProps;
