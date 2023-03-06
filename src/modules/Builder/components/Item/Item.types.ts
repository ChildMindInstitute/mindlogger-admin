export type ItemType = {
  id: string;
  name: string;
  description: string;
  img?: string;
  count?: number;
  index?: number;
  total?: number;
};

type Action = {
  icon: JSX.Element;
  action: (item?: ItemType) => void;
  toolTipTitle?: string;
};

export type ItemProps = {
  getActions: () => Action[];
  withHover?: boolean;
} & ItemType;
