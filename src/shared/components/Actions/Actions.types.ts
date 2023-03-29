export type Action = {
  icon: JSX.Element;
  action: (item?: any) => any | void;
  disabled?: boolean;
  tooltipTitle?: string;
  isDisplayed?: boolean;
  active?: boolean;
};

export type ActionsProps<T extends Record<string, any>> = {
  items: Action[];
  context: T;
  visibleByDefault?: boolean;
};
