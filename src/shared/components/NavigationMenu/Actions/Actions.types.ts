import { Item, NavigationItem } from '../NavigationMenu.types';

export type ActionsProps = {
  title?: string;
  items?: Item[];
  isCompact: boolean;
  onItemClick?: (value: NavigationItem) => void;
};
