export type AlertProps = {
  name: string;
  index: number;
  removeAlert: (i: number) => void;
};

export const enum OptionTypes {
  Option = 'option',
  Slider = 'slider',
  Row = 'row',
}
