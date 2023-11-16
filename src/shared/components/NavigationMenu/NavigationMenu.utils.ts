import { Item } from './NavigationMenu.types';

export const getActiveItem = (items: Item[], settingPath?: string) => {
  const group = items.find(({ items }) => items.find(({ param }) => param === settingPath));

  return group?.items.find(({ param }) => param === settingPath) || null;
};
