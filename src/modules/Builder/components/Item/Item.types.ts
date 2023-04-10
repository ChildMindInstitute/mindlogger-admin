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
  Activity = 'activity',
  Flow = 'flow',
}

export type ItemProps = {
  getActions: (key?: string) => Action[];
  isInactive?: boolean;
  visibleByDefault?: boolean;
  hasStaticActions?: boolean;
  uiType?: ItemUiType;
  onItemClick?: () => void;
} & ItemType;
