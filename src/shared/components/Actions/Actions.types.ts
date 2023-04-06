export type Action = {
  icon: JSX.Element;
  action: (item?: any) => any | void;
  disabled?: boolean;
  tooltipTitle?: string;
  isDisplayed?: boolean;
  active?: boolean;
  isStatic?: boolean;
};

export type ActionsProps = {
  items: Action[];
  context: unknown;
  visibleByDefault?: boolean;
  hasStaticActions?: boolean;
};
