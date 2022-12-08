type Tab = {
  labelKey: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
  content: JSX.Element;
  isMinHeightAuto?: boolean;
};

export type TabsProps = { tabs: Tab[] };
