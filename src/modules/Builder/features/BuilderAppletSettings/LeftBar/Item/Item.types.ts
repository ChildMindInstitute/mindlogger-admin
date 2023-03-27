import { LeftBarProps } from '../LeftBar.types';
import { ActivitySettings } from '../../BuilderAppletSettings.const';

export type ItemProps = {
  name: ActivitySettings;
  icon: JSX.Element;
} & LeftBarProps;
