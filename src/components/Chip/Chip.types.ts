export enum ChipShape {
  rectangular = 'rectangular',
  rounded = 'rounded',
}

export type ChipProps = {
  title: string;
  onRemove?: () => void;
  color?: 'primary' | 'secondary';
  shape?: ChipShape;
};
