type Action = {
  icon: JSX.Element;
  action: (item?: any) => any | void;
  disabled?: boolean;
  toolTipTitle?: string;
};

export type ActionsProps = {
  items: Action[];
  context: unknown;
};
