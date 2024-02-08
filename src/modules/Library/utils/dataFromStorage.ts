import { STORAGE_LIBRARY_KEY, STORAGE_SELECTED_KEY } from 'modules/Library/consts';
import { PublishedApplet } from 'modules/Library/state';
import { LibraryForm } from 'modules/Library/features/Applet';

import { getUpdatedSelectedItems } from './getCheckedItems';

export const getAppletsFromStorage = (): PublishedApplet[] => {
  const storageData = sessionStorage.getItem(STORAGE_LIBRARY_KEY);

  return storageData ? JSON.parse(storageData) : [];
};

export const getSelectedItemsFromStorage = (): LibraryForm => {
  const storageData = sessionStorage.getItem(STORAGE_SELECTED_KEY);

  return storageData ? JSON.parse(storageData) : {};
};

export const getSelectedAppletFromStorage = (id: string) => {
  const storageSelectedData = getSelectedItemsFromStorage();
  if (!Object.keys(storageSelectedData).length) return;

  return storageSelectedData[id];
};

export const updateSelectedItemsInStorage = (newSelectedItems: LibraryForm, appletId: string) => {
  const selectedItemsFromStorage = getSelectedItemsFromStorage();
  const updatedSelectedItems = getUpdatedSelectedItems(selectedItemsFromStorage, newSelectedItems, appletId);

  updatedSelectedItems
    ? sessionStorage.setItem(STORAGE_SELECTED_KEY, JSON.stringify(updatedSelectedItems))
    : sessionStorage.removeItem(STORAGE_SELECTED_KEY);

  return { isNoSelectedItems: !updatedSelectedItems };
};
