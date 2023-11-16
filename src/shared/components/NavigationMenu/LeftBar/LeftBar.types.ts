import { Item, NavigationItem } from '../NavigationMenu.types';

export type LeftBarProps = {
  title: string;
  items: Item[];
  hasActiveItem: boolean;
  onItemClick: (value: NavigationItem) => void;
};
