import { useContext, useState } from 'react';

import { AppletContextType, AppletsContext } from 'modules/Dashboard/features/Applets/Applets';
import { Applet, Folder, addAppletToFolderApi, removeAppletFromFolderApi } from 'api';
import { useAsync } from 'shared/hooks';

export const useAppletsDnd = () => {
  const { rows, fetchData } = useContext(AppletsContext) as AppletContextType;

  const { execute: removeAppletFromFolder } = useAsync(removeAppletFromFolderApi);
  const { execute: addAppletToFolder } = useAsync(addAppletToFolderApi);

  const [isDragOver, setIsDragOver] = useState(false);

  const onDragLeave = (event: React.DragEvent<HTMLTableRowElement>) => {
    event.persist();
    event.preventDefault();
    setIsDragOver(false);
  };

  const onDragOver = (event: React.DragEvent<HTMLTableRowElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const onDragEnd = async (event: React.DragEvent<HTMLTableRowElement>, applet: Applet) => {
    if (event.dataTransfer?.dropEffect === 'none' && applet.parentId) {
      await removeAppletFromFolder({ appletId: applet.id });
      await fetchData();
    }
  };

  const onDrop = async (
    event: React.DragEvent<HTMLTableRowElement>,
    droppedItem: Folder | Applet,
  ) => {
    onDragLeave(event);

    const draggedId = event.dataTransfer.getData('text');
    const draggedItem = rows?.filter(({ id }) => id === draggedId)[0] as Applet;

    if (!draggedItem || !droppedItem) return;

    const wasInFolder = draggedItem?.parentId;
    const isMovingToFolder =
      (droppedItem.isFolder || (droppedItem as Applet)?.parentId) &&
      draggedItem.parentId !== droppedItem.id;

    const folder = droppedItem.isFolder
      ? droppedItem
      : rows?.filter((row) => row.id === (droppedItem as Applet).parentId)[0];

    if (!wasInFolder && isMovingToFolder) {
      await addAppletToFolder({ folderId: folder.id, appletId: draggedItem.id });

      return await fetchData();
    }

    if (isMovingToFolder && wasInFolder) {
      const previousFolder = rows?.filter((row) => row.id === draggedItem.parentId)[0];

      if (previousFolder.id === folder.id) return;

      await removeAppletFromFolder({ appletId: draggedItem.id });
      await addAppletToFolder({ folderId: folder.id, appletId: draggedItem.id });

      return await fetchData();
    }

    if (!wasInFolder) return;

    await removeAppletFromFolder({ appletId: draggedItem.id });
    await fetchData();
  };

  return { isDragOver, onDragLeave, onDragOver, onDrop, onDragEnd };
};
