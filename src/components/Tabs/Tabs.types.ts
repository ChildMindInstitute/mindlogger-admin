type Tab = {
  labelKey: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
  content: JSX.Element;
};

export type TabsProps = { tabs: Tab[] };
