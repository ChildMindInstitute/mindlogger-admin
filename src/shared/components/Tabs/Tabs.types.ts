import { Dispatch, SetStateAction } from 'react';

type Tab = {
  labelKey: string;
  icon?: JSX.Element;
  activeIcon?: JSX.Element;
  content?: JSX.Element;
  onClick?: () => void;
  isMinHeightAuto?: boolean;
  path?: string;
  id?: string;
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
};

export type RenderTabs = {
  header: JSX.Element[];
  content: JSX.Element[];
};
