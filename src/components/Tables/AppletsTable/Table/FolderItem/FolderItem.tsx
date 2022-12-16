import { useEffect, useState, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { InputAdornment, OutlinedInput, TableCell, TableRow } from '@mui/material';

import { useAppletsDnd } from 'hooks';
import { useAppDispatch } from 'redux/store';
import { FolderApplet, folders } from 'redux/modules';
import { Svg } from 'components/Svg';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { variables } from 'styles/variables';
import { Actions } from 'components/Actions';

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
  const { isDragOver, onDragLeave, onDragOver, onDrop } = useAppletsDnd();
  const foldersApplets: FolderApplet[] = folders.useFlattenFoldersApplets();

  const [folder, setFolder] = useState(item);

  const handleRenameFolder = () => {
    setFolder((folder) => ({ ...folder, isRenaming: true }));
  };

  const onDeleteFolder = () => {
    if (folder.isNew) {
      return dispatch(folders.actions.deleteNewFolder({ folderId: folder.id }));
    }
    dispatch(folders.thunk.deleteFolder({ folderId: folder.id }));
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
    const name = !isNameExist && folder.name?.trim() ? folder.name?.trim() : item.name;
    const updatedFolder = { ...folder, name };
    const { updateFolder, saveFolder } = folders.thunk;
    if (!folder.isNew) {
      dispatch(updateFolder(updatedFolder));
    } else {
      dispatch(saveFolder(updatedFolder));
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
                      <Svg width={24} height={24} id="cross" />
                    </StyledCloseButton>
                  </InputAdornment>
                }
              />
            ) : (
              <>
                <StyledBodyMedium color={variables.palette.on_surface} fontWeight={'medium'}>
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
