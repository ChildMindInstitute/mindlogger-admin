type Tab = {
  labelKey: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
  content: JSX.Element;
  onClick?: () => void;
  isMinHeightAuto?: boolean;
};

export type TabsProps = { tabs: Tab[]; activeTab?: number };

export type RenderTabs = {
  header: JSX.Element[];
  content: JSX.Element[];
};
