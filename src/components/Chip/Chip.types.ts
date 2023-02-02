export enum ChipShape {
  rectangular = 'rectangular',
  rounded = 'rounded',
}

export type ChipProps = {
  title: string | JSX.Element;
  onRemove?: () => void;
  color?: 'primary' | 'secondary' | 'error';
  shape?: ChipShape;
  icon?: React.ReactElement | undefined;
};
