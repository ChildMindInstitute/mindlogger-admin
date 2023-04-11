export type ItemType = {
  id?: string;
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

export enum ItemUiType {
  Activity,
  Flow,
  FlowBuilder,
}

export type ItemProps = {
  getActions: (key?: string) => Action[];
  isInactive?: boolean;
  hasError?: boolean;
  visibleByDefault?: boolean;
  hasStaticActions?: boolean;
  uiType?: ItemUiType;
  onItemClick?: () => void;
} & ItemType;
