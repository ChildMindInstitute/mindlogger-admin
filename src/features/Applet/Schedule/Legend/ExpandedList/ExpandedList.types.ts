type Button = {
  icon: JSX.Element;
  action: () => void;
  tooltipTitle: string;
};

export type ExpandedListProps = {
  title: string;
  items: JSX.Element[];
  buttons: Button[];
};
