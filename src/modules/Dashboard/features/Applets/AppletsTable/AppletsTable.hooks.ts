import { useContext, useState, DragEvent } from 'react';

import { AppletsContext } from 'modules/Dashboard/features/Applets/Applets.context';
import { AppletContextType } from 'modules/Dashboard/features/Applets/Applets.types';
import { Applet, Folder, setFolderApi } from 'api';
import { useAsync } from 'shared/hooks/useAsync';

export const useAppletsDnd = () => {
  const { rows, fetchData } = useContext(AppletsContext) as AppletContextType;

  const { execute: setFolder } = useAsync(setFolderApi);

  const [isDragOver, setIsDragOver] = useState(false);

  const onDragLeave = (event: DragEvent<HTMLTableRowElement>) => {
    event.persist();
    event.preventDefault();
    setIsDragOver(false);
  };

  const onDragOver = (event: DragEvent<HTMLTableRowElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const onDragEnd = async (event: DragEvent<HTMLTableRowElement>, applet: Applet) => {
    if (event.dataTransfer?.dropEffect === 'none' && applet.parentId) {
      await setFolder({ appletId: applet.id });
      fetchData();
    }
  };

  const onDrop = async (event: DragEvent<HTMLTableRowElement>, droppedItem: Folder | Applet) => {
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
      await setFolder({ folderId: folder.id, appletId: draggedItem.id });
      fetchData();

      return;
    }

    if (isMovingToFolder && wasInFolder) {
      const previousFolder = rows?.filter((row) => row.id === draggedItem.parentId)[0];

      if (previousFolder.id === folder.id) return;
      await setFolder({ folderId: folder.id, appletId: draggedItem.id });
      fetchData();

      return;
    }

    if (!wasInFolder) return;

    await setFolder({ appletId: draggedItem.id });
    fetchData();
  };

  return { isDragOver, onDragLeave, onDragOver, onDrop, onDragEnd };
};
