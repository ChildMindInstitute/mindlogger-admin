import { useEffect, useState, KeyboardEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { InputAdornment, OutlinedInput, TableCell, TableRow } from '@mui/material';

import { useAsync } from 'shared/hooks';
import { workspaces } from 'redux/modules';
import { Svg, Actions } from 'shared/components';
import { StyledBodyMedium, StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';
import { AppletsContext } from 'modules/Dashboard/features/Applets/Applets';
import { deleteFolderApi, saveFolderApi, updateFolderApi } from 'api';
import { useAppletsDnd } from 'modules/Dashboard/features/Applets/Table/Table.hooks';
import { AppletContextType } from 'modules/Dashboard/features/Applets/Applets.types';

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

  const { rows, setRows, expandedFolders, fetchData, handleFolderClick } = useContext(
    AppletsContext,
  ) as AppletContextType;
  const { execute: saveFolder } = useAsync(saveFolderApi);
  const { execute: updateFolder } = useAsync(updateFolderApi);
  const { execute: deleteFolder } = useAsync(deleteFolderApi);

  const { ownerId } = workspaces.useData() || {};
  const { isDragOver, onDragLeave, onDragOver, onDrop } = useAppletsDnd();

  const [folder, setFolder] = useState(item);

  const isFolderExpanded = !!expandedFolders.find((id) => id === item.id);

  const handleRenameFolder = () => {
    setFolder((folder) => ({ ...folder, isRenaming: true }));
  };

  const onDeleteFolder = async () => {
    if (folder.appletCount || !ownerId) return;
    if (folder.isNew) {
      setRows([...rows.filter(({ id }) => id !== item.id)]);
    }
    await deleteFolder({ ownerId, folderId: folder.id });
    await fetchData();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolder((folder) => ({ ...folder, name: event.target.value }));
  };

  const handleClearClick = () => {
    setFolder((folder) => ({ ...folder, name: '' }));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      saveFolderHandler();
    }
  };

  const handleBlur = () => {
    saveFolderHandler();
  };

  const saveFolderHandler = async () => {
    if (!folder.isNew && folder.name === item.name) {
      return setFolder((folder) => ({ ...folder, isRenaming: false }));
    }

    if (!ownerId) return;

    const name = folder.name?.trim() || item.name;

    if (!folder.isNew) {
      await updateFolder({ ownerId, name, folderId: folder.id });
    } else {
      await saveFolder({ ownerId, name: folder.name });
    }
    await fetchData();
  };

  const onFolderClick = () => {
    if (!item?.appletCount) return;
    handleFolderClick(item);
  };

  useEffect(() => setFolder(item), [item]);

  return (
    <TableRow
      className={isDragOver ? 'dragged-over' : ''}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={(event) => onDrop(event, item)}
    >
      <TableCell width="30%" onClick={() => (!folder?.isRenaming ? onFolderClick() : null)}>
        <StyledFlexTopCenter>
          <StyledFolderIcon>
            <Svg id={isFolderExpanded ? 'folder-opened' : 'folder'} />
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
                      onMouseDown={(event) => {
                        event.preventDefault();
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
                  ({item?.appletCount ? `${item?.appletCount} ${t('applets')}` : `${t('empty')}`})
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
