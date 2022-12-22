type Tab = {
  labelKey: string;
  icon?: JSX.Element;
  activeIcon?: JSX.Element;
  content?: JSX.Element;
  onClick?: () => void;
  isMinHeightAuto?: boolean;
  path?: string;
};

export enum UiType {
  primary = 'primary',
  secondary = 'secondary',
}

export type TabsProps = { uiType?: UiType; tabs: Tab[]; activeTab?: number };

export type RenderTabs = {
  header: JSX.Element[];
  content: JSX.Element[];
};
