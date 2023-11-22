import { ReactNode } from 'react';

export type NavigationItem = {
  name?: string;
  label: string;
  component: ReactNode;
  icon: ReactNode;
  param: string;
  tooltip?: string;
  disabled?: boolean;
  isVisible?: boolean;
  hasError?: boolean;
  onClick?: () => void;
  'data-testid'?: string;
};

export type Item = {
  label: string;
  items: NavigationItem[];
  isVisible?: boolean;
};

export type NavigationMenuProps = {
  title: string;
  items: Item[];
  onClose: () => void;
  onSetActiveItem: (item: NavigationItem) => void;
  'data-testid'?: string;
};
