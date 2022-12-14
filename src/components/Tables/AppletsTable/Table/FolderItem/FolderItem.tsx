import { useEffect, useState, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { InputAdornment, OutlinedInput, TableCell, TableRow } from '@mui/material';

import { useAppletsDnd } from 'hooks';
import { useAppDispatch } from 'redux/store';
import { folders } from 'redux/modules';
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
} from './FolderItem.styles';
import { getActions } from './FolderItem.const';

export const FolderItem = ({ item }: FolderItemProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { isDragOver, onDragLeave, onDragOver, onDrop } = useAppletsDnd();

  const [folder, setFolder] = useState(item);

  const onRenameFolder = () => {
    setFolder((folder) => ({ ...folder, isRenaming: true }));
  };

  const onDeleteFolder = () => {
    if (folder.isNew) {
      return dispatch(folders.actions.deleteNewFolder({ folderId: folder.id }));
    }
    dispatch(folders.thunk.deleteFolder({ folderId: folder.id }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolder((folder) => ({ ...folder, name: event.target.value }));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (!folder.isNew) {
        dispatch(folders.thunk.updateFolder(folder));
      } else {
        dispatch(folders.thunk.saveFolder(folder));
      }
    }
  };

  const handleFolderClick = () => {
    if (!folder?.items?.length) return;
    dispatch(folders.actions.expandFolder(folder));
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
                value={folder.name}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                endAdornment={
                  <InputAdornment position="end">
                    <Svg id="cancel-rounded" />
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
        <Actions items={getActions(folder, onRenameFolder, onDeleteFolder)} context={item} />
      </StyledCell>
    </TableRow>
  );
};
