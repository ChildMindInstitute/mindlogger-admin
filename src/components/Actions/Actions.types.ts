export type Action = {
  icon: JSX.Element;
  action: (item?: any) => any | void;
  disabled?: boolean;
};
