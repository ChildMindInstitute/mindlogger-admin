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
  Primary = 'primary',
  Secondary = 'secondary',
}

export type TabsProps = {
  uiType?: UiType;
  tabs: Tab[];
  activeTab?: number;
  hideHeader?: boolean;
};

export type RenderTabs = {
  header: JSX.Element[];
  content: JSX.Element[];
};
