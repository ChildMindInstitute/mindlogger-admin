type Tab = {
  labelKey: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
  content: JSX.Element;
  onClick?: () => void;
};

export type TabsProps = { tabs: Tab[]; activeTab?: number };
