export type BuilderItemType = {
  id: string;
  name: string;
  description: string;
  img?: string;
  count?: number;
};

type Action = {
  icon: JSX.Element;
  action: (item?: BuilderItemType) => void;
  toolTipTitle?: string;
};

export type BuilderItemProps = {
  getActions: () => Action[];
  withHover?: boolean;
} & BuilderItemType;
