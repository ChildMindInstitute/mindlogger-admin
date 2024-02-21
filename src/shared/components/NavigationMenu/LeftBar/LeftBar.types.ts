import { Item, NavigationItem } from '../NavigationMenu.types';

export type LeftBarProps = {
  title: string;
  items: Item[];
  isCompact: boolean;
  onItemClick: (value: NavigationItem) => void;
};
