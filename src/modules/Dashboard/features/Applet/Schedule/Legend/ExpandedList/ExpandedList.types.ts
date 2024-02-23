type Button = {
  icon: JSX.Element;
  action: () => void;
  tooltipTitle: string;
  disabled?: boolean;
};

export type ExpandedListProps = {
  title: string;
  items: JSX.Element[];
  buttons: Button[];
  isHiddenInLegend?: boolean;
  allAvailableScheduled?: boolean;
  'data-testid'?: string;
};
