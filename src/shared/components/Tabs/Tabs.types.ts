import { Dispatch, SetStateAction } from 'react';

export type Tab = {
  id: string;
  labelKey: string;
  icon?: JSX.Element;
  activeIcon?: JSX.Element;
  content?: JSX.Element;
  onClick?: () => void;
  isMinHeightAuto?: boolean;
  path?: string;
  hasError?: boolean;
  'data-testid'?: string;
};

export enum UiType {
  Primary = 'primary',
  Secondary = 'secondary',
}

export type TabsProps = {
  uiType?: UiType;
  tabs: Tab[];
  activeTab?: number;
  setActiveTab?: Dispatch<SetStateAction<number>>;
  hiddenHeader?: boolean;
  isBuilder?: boolean;
  isCentered?: boolean;
  deepPathCompare?: boolean;
  defaultToFirstTab?: boolean;
  animateTabIndicator?: boolean;
  animationDurationMs?: number;
};

export type RenderTabs = {
  header: JSX.Element[];
  content: JSX.Element[];
};
