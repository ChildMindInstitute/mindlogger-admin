import { LeftBarProps } from '../LeftBar.types';

export type ItemProps = {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  hidden: boolean;
} & LeftBarProps;
