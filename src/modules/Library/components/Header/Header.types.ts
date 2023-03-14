export enum RightButtonType {
  Cart = 'cart',
  Builder = 'builder',
}

export type HeaderProps = {
  isBackButtonVisible?: boolean;
  handleSearch?: (value: string) => void;
  rightButtonType?: RightButtonType;
  rightButtonCallback?: () => void;
};
