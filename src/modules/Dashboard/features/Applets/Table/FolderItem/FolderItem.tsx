import { useEffect, useState, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { InputAdornment, OutlinedInput, TableCell, TableRow } from '@mui/material';

import { useAppletsDnd } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import { FolderApplet, folders, workspaces } from 'redux/modules';
import { Svg, Actions } from 'shared/components';
import { StyledBodyMedium, StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { FolderItemProps } from './FolderItem.types';
import {
  StyledFolderIcon,
  StyledCountApplets,
  StyledFolderName,
  StyledCell,
  StyledCloseButton,
} from './FolderItem.styles';
import { getActions } from './FolderItem.const';

export const FolderItem = ({ item }: FolderItemProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { ownerId } = workspaces.useData() || {};
  const { isDragOver, onDragLeave, onDragOver, onDrop } = useAppletsDnd();
  const foldersApplets: FolderApplet[] = folders.useFlattenFoldersApplets();

  const [folder, setFolder] = useState(item);

  const handleRenameFolder = () => {
    setFolder((folder) => ({ ...folder, isRenaming: true }));
  };

  const onDeleteFolder = () => {
    if (folder.items?.length) return;
    if (folder.isNew) {
      return dispatch(folders.actions.deleteFolderApplet({ id: folder.id }));
    }
    ownerId && dispatch(folders.thunk.deleteFolder({ ownerId, folderId: folder.id }));
  };

  const handleFolderClick = () => {
    if (!folder?.items?.length) return;
    dispatch(folders.actions.expandFolder(folder));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolder((folder) => ({ ...folder, name: event.target.value }));
  };

  const handleClearClick = () => {
    setFolder((folder) => ({ ...folder, name: '' }));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      saveFolder();
    }
  };

  const handleBlur = () => {
    saveFolder();
  };

  const saveFolder = () => {
    if (!folder.isNew && folder.name === item.name) {
      return setFolder((folder) => ({ ...folder, isRenaming: false }));
    }
    const isNameExist = foldersApplets.find(
      (folderApplet) => folderApplet.isFolder && folderApplet.name === folder.name?.trim(),
    );
    const name = (!isNameExist && folder.name?.trim()) || item.name;
    const updatedFolder = { ...folder, name };
    const { updateFolder, saveFolder } = folders.thunk;
    if (!folder.isNew) {
      ownerId && dispatch(updateFolder({ ownerId, folder: updatedFolder }));
    } else {
      ownerId && dispatch(saveFolder({ ownerId, folder: updatedFolder }));
    }
  };

  useEffect(() => setFolder(item), [item]);

  return (
    <TableRow
      className={isDragOver ? 'dragged-over' : ''}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, item)}
    >
      <TableCell width="30%" onClick={() => (!folder?.isRenaming ? handleFolderClick() : null)}>
        <StyledFlexTopCenter>
          <StyledFolderIcon>
            <Svg id={folder?.isExpanded ? 'folder-opened' : 'folder'} />
          </StyledFolderIcon>
          <StyledFolderName>
            {folder?.isRenaming ? (
              <OutlinedInput
                autoFocus
                error={!folder.name}
                placeholder={t('newFolder')}
                value={folder.name}
                onBlur={handleBlur}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                endAdornment={
                  <InputAdornment position="end">
                    <StyledCloseButton
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleClearClick();
                      }}
                    >
                      <Svg id="cross" />
                    </StyledCloseButton>
                  </InputAdornment>
                }
              />
            ) : (
              <>
                <StyledBodyMedium color={variables.palette.on_surface}>
                  {folder.name}
                </StyledBodyMedium>
                <StyledCountApplets>
                  (
                  {item?.items?.length ? `${item?.items?.length} ${t('applets')}` : `${t('empty')}`}
                  )
                </StyledCountApplets>
              </>
            )}
          </StyledFolderName>
        </StyledFlexTopCenter>
      </TableCell>
      <TableCell width="20%"></TableCell>
      <StyledCell>
        <Actions items={getActions(folder, handleRenameFolder, onDeleteFolder)} context={item} />
      </StyledCell>
    </TableRow>
  );
};
