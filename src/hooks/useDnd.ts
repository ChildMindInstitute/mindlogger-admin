import { useState } from 'react';

import { useAppDispatch } from 'redux/store';
import { FolderApplet, folders } from 'redux/modules';

export const useDnd = () => {
  const dispatch = useAppDispatch();

  const foldersApplets: FolderApplet[] | null = folders.useFlattenFoldersApplets();
  const [isDragOver, setIsDragOver] = useState(false);

  const onDragEnter = (event: React.DragEvent<HTMLTableRowElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = (event: React.DragEvent<HTMLTableRowElement>) => {
    event.persist();
    event.preventDefault();
    setIsDragOver(false);
  };

  const onDragOver = (event: React.DragEvent<HTMLTableRowElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const onDrop = (event: React.DragEvent<HTMLTableRowElement>, droppedItem: FolderApplet) => {
    event.persist();
    event.preventDefault();
    setIsDragOver(false);

    const draggedId = event.dataTransfer.getData('text');
    const draggedItem = foldersApplets?.filter((folderApplet) => folderApplet.id === draggedId)[0];

    if (!draggedItem || !droppedItem) return;

    const wasInFolder = draggedItem.parentId;
    const isMovingToFolder =
      (droppedItem.isFolder || droppedItem.parentId) && draggedItem.parentId !== droppedItem.id;

    const folder = droppedItem.isFolder
      ? droppedItem
      : foldersApplets?.filter((folderApplet) => folderApplet.id === droppedItem.parentId)[0];

    if (!wasInFolder && isMovingToFolder) {
      return dispatch(folders.thunk.addAppletToFolder({ folder, applet: draggedItem }));
    }

    if (isMovingToFolder && wasInFolder) {
      const previousFolder = foldersApplets?.filter(
        (folderApplet) => folderApplet.id === draggedItem.parentId,
      )[0];

      return dispatch(
        folders.thunk.changeFolder({
          previousFolder,
          applet: draggedItem,
          newFolder: folder,
        }),
      );
    }

    if (!wasInFolder) return;

    return dispatch(
      folders.thunk.removeAppletFromFolder({
        applet: draggedItem,
      }),
    );
  };

  return { isDragOver, onDragEnter, onDragLeave, onDragOver, onDrop };
};
