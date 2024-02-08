import { LibraryForm } from 'modules/Library/features/Applet';

export const getFilteredSelectedItems = (storageItems: LibraryForm, id: string) =>
  Object.keys(storageItems).reduce((acc: LibraryForm, key) => {
    if (key !== id) {
      acc[key] = storageItems[key];
    }

    return acc;
  }, {});

export const getUpdatedSelectedItems = (storageItems: LibraryForm, selectedItems: LibraryForm, id: string) => {
  const otherAppletSelectedItems = getFilteredSelectedItems(storageItems, id);

  if (Object.keys(otherAppletSelectedItems)?.length > 0) {
    return { ...otherAppletSelectedItems, ...(selectedItems[id].length && selectedItems) };
  }

  if (selectedItems[id]?.length) return selectedItems;

  return null;
};
