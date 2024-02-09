import { useEffect, useState, KeyboardEvent, useContext, ChangeEvent } from 'react';

import { InputAdornment, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { deleteFolderApi, saveFolderApi, updateFolderApi } from 'api';
import { AppletsColumnsWidth } from 'modules/Dashboard/features/Applets/Applets.const';
import { AppletsContext } from 'modules/Dashboard/features/Applets/Applets.context';
import { AppletContextType } from 'modules/Dashboard/features/Applets/Applets.types';
import { useAppletsDnd } from 'modules/Dashboard/features/Applets/AppletsTable/AppletsTable.hooks';
import { workspaces } from 'redux/modules';
import { Svg, Actions } from 'shared/components';
import { useAsync } from 'shared/hooks/useAsync';
import { StyledBodyMedium, StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { StyledTableCell } from '../AppletsTable.styles';
import { getActions } from './FolderItem.const';
import {
  StyledFolderIcon,
  StyledCountApplets,
  StyledFolderName,
  StyledCloseButton,
  StyledOutlinedInput,
} from './FolderItem.styles';
import { FolderItemProps } from './FolderItem.types';

export const FolderItem = ({ item }: FolderItemProps) => {
  const { t } = useTranslation('app');

  const { rows, setRows, expandedFolders, reloadData, handleFolderClick } = useContext(
    AppletsContext,
  ) as AppletContextType;
  const { execute: saveFolder } = useAsync(saveFolderApi);
  const { execute: updateFolder } = useAsync(updateFolderApi);
  const { execute: deleteFolder } = useAsync(deleteFolderApi);

  const { ownerId } = workspaces.useData() || {};
  const { isDragOver, onDragLeave, onDragOver, onDrop } = useAppletsDnd();

  const [folder, setFolder] = useState(item);
  const [hasVisibleActions, setHasVisibleActions] = useState(false);

  const isFolderExpanded = !!expandedFolders.find((id) => id === item.id);

  const handleRenameFolder = () => {
    setFolder((folder) => ({ ...folder, isRenaming: true }));
  };

  const onDeleteFolder = async () => {
    if (folder.foldersAppletCount || !ownerId) return;
    if (folder.isNew) {
      setRows([...rows.filter(({ id }) => id !== item.id)]);
    }
    await deleteFolder({ ownerId, folderId: folder.id });
    await reloadData();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFolder((folder) => ({ ...folder, displayName: event.target.value }));
  };

  const handleClearClick = () => {
    setFolder((folder) => ({ ...folder, displayName: '' }));
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
    if (!folder.isNew && folder.displayName === item.displayName) {
      return setFolder((folder) => ({ ...folder, isRenaming: false }));
    }

    if (!ownerId) return;

    const name = folder.displayName?.trim() || item.displayName;

    if (folder.isNew) {
      await saveFolder({ ownerId, name: folder.displayName });
    } else {
      await updateFolder({ ownerId, name, folderId: folder.id });
    }
    await reloadData();
  };

  const onFolderClick = () => {
    if (!item?.foldersAppletCount) return;
    handleFolderClick(item);
  };

  const folderAppletCount = item?.foldersAppletCount ? `${item?.foldersAppletCount} ${t('applets')}` : `${t('empty')}`;

  useEffect(() => setFolder(item), [item]);

  return (
    <TableRow
      className={isDragOver ? 'dragged-over' : ''}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={(event) => onDrop(event, item)}
      onMouseEnter={() => setHasVisibleActions(true)}
      onMouseLeave={() => setHasVisibleActions(false)}>
      <StyledTableCell width={AppletsColumnsWidth.Folder} onClick={() => (folder?.isRenaming ? null : onFolderClick())}>
        <StyledFlexTopCenter>
          <StyledFolderIcon>
            <Svg id={isFolderExpanded ? 'folder-opened' : 'folder'} />
          </StyledFolderIcon>
          <StyledFolderName>
            {folder?.isRenaming ? (
              <StyledOutlinedInput
                autoFocus
                error={!folder.displayName}
                placeholder={t('newFolder')}
                value={folder.displayName}
                onBlur={handleBlur}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                endAdornment={
                  <InputAdornment position="end">
                    <StyledCloseButton
                      data-testid="folder-clear-button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleClearClick();
                      }}>
                      <Svg id="cross" />
                    </StyledCloseButton>
                  </InputAdornment>
                }
              />
            ) : (
              <>
                <StyledBodyMedium color={variables.palette.on_surface}>
                  {folder.displayName ?? folder.name}
                </StyledBodyMedium>
                <StyledCountApplets>({folderAppletCount})</StyledCountApplets>
              </>
            )}
          </StyledFolderName>
        </StyledFlexTopCenter>
      </StyledTableCell>
      <StyledTableCell>
        <Actions
          items={getActions(folder, handleRenameFolder, onDeleteFolder)}
          context={item}
          visibleByDefault={hasVisibleActions}
          data-testid="dashboard-applets-table-folder-actions"
        />
      </StyledTableCell>
    </TableRow>
  );
};
