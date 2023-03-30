export enum ChipShape {
  Rectangular = 'rectangular',
  Rounded = 'rounded',
}

export type ChipProps = {
  title: string | JSX.Element;
  onRemove?: () => void;
  color?: 'primary' | 'secondary' | 'error';
  shape?: ChipShape;
  icon?: React.ReactElement | undefined;
  canRemove?: boolean;
  onClick?: () => void;
};
