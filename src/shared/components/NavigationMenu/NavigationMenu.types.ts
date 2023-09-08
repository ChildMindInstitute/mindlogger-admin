import { ReactNode } from 'react';

export type NavigationItem = {
  name?: string;
  label: string;
  component: ReactNode;
  icon: ReactNode;
  param: string;
  tooltip?: string;
  disabled?: boolean;
  visibility?: boolean;
  'data-testid'?: string;
};

export type Item = {
  label: string;
  items: NavigationItem[];
  visibility?: boolean;
};

export type NavigationMenuProps = {
  title: string;
  items: Item[];
  onClose: () => void;
  onSetActiveItem: (item: NavigationItem) => void;
};
