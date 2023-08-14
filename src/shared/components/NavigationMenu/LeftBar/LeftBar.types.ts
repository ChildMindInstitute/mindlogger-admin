import { Item, NavigationItem } from '../NavigationMenu.types';

export type LeftBarProps = {
  items: Item[];
  activeItem: NavigationItem | null;
  isCompact: boolean;
  onItemClick: (value: NavigationItem) => void;
};
