import { useEffect, useState, KeyboardEvent, useContext, ChangeEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ClickAwayListener, InputAdornment, TableRow } from '@mui/material';

import { useAsync } from 'shared/hooks/useAsync';
import { workspaces } from 'redux/modules';
import { Svg, ActionsMenu } from 'shared/components';
import { StyledBodyMedium, StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';
import { AppletsContext } from 'modules/Dashboard/features/Applets/Applets.context';
import { AppletsColumnsWidth } from 'modules/Dashboard/features/Applets/Applets.const';
import { deleteFolderApi, saveFolderApi, updateFolderApi } from 'modules/Dashboard/api';
import { useAppletsDnd } from 'modules/Dashboard/features/Applets/AppletsTable/AppletsTable.hooks';
import { AppletContextType } from 'modules/Dashboard/features/Applets/Applets.types';

import { StyledTableCell } from '../AppletsTable.styles';
import { getTableRowClassNames } from '../AppletsTable.utils';
import { FolderItemProps } from './FolderItem.types';
import {
  StyledFolderIcon,
  StyledCountApplets,
  StyledFolderName,
  StyledCloseButton,
  StyledOutlinedInput,
} from './FolderItem.styles';
import { getFolderActions } from './FolderItem.utils';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState(item);

  const isFolderExpanded = !!expandedFolders.find((id) => id === item.id);

  const handleRenameFolder = () => {
    setFolder((prevFolderValue) => ({ ...prevFolderValue, isRenaming: true }));
  };

  const handleDeleteFolder = async () => {
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

  const handleClickAway = () => {
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

  const folderAppletCount = item?.foldersAppletCount
    ? `${item?.foldersAppletCount} ${t('applets')}`
    : `${t('empty')}`;

  useEffect(() => setFolder(item), [item]);

  useEffect(() => {
    if (folder.isRenaming) {
      inputRef.current?.focus();
    }
  }, [folder.isRenaming]);

  return (
    <TableRow
      className={getTableRowClassNames({ hasHover: !!item?.foldersAppletCount, isDragOver })}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={(event) => onDrop(event, item)}
      data-testid="dashboard-applets-table-folder-row"
    >
      <StyledTableCell
        width={AppletsColumnsWidth.Folder}
        onClick={() => (folder?.isRenaming ? null : onFolderClick())}
      >
        <StyledFlexTopCenter>
          <StyledFolderIcon>
            <Svg
              id={isFolderExpanded && !!folder.foldersAppletCount ? 'folder-opened' : 'folder'}
            />
          </StyledFolderIcon>
          <StyledFolderName>
            {folder?.isRenaming ? (
              <ClickAwayListener onClickAway={handleClickAway}>
                <StyledOutlinedInput
                  autoFocus
                  error={!folder.displayName}
                  placeholder={t('newFolder')}
                  value={folder.displayName}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  inputRef={inputRef}
                  endAdornment={
                    <InputAdornment position="end">
                      <StyledCloseButton
                        data-testid="folder-clear-button"
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
              </ClickAwayListener>
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
        <ActionsMenu
          menuItems={getFolderActions(folder, handleRenameFolder, handleDeleteFolder)}
          data-testid="dashboard-applets-table-folder-actions"
        />
      </StyledTableCell>
    </TableRow>
  );
};
