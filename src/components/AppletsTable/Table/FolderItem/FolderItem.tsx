import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputAdornment, TableCell, TableRow } from '@mui/material';

import { useAppDispatch } from 'redux/store';
import { folders } from 'redux/modules';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { Svg } from 'components/Svg';
import { variables } from 'styles/variables';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

import { FolderItemProps } from './FolderItem.types';
import {
  StyledFolderIcon,
  StyledTextField,
  StyledCountApplets,
  StyledFolderName,
  StyledCell,
  StyledActions,
  StyledActionButton,
} from './FolderItem.styles';
import { getActions } from './FolderItem.const';

export const FolderItem = ({ item, onFolderClick }: FolderItemProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  const [folder, setFolder] = useState(item);

  const onRenameFolder = () => {
    setFolder((row) => ({ ...row, isRenaming: true }));
  };

  const onDeleteFolder = () => {
    if (folder.isNew) {
      return dispatch(folders.actions.deleteNewFolder({ folderId: folder.id }));
    }
    dispatch(folders.thunk.deleteFolder({ folderId: folder.id }));
  };

  const actions = getActions(folder, onRenameFolder, onDeleteFolder);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolder((row) => ({ ...row, name: event.target.value }));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
    onFolderClick(folder);
  };

  useEffect(() => setFolder(item), [item]);

  return (
    <TableRow>
      <TableCell width="30%" onClick={() => (!folder?.isRenaming ? handleFolderClick() : null)}>
        <StyledFlexTopCenter>
          <StyledFolderIcon>
            <Svg id={folder?.isExpanded ? 'folder-opened' : 'folder'} />
          </StyledFolderIcon>
          <StyledFolderName>
            {folder?.isRenaming ? (
              <StyledTextField
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
        <>
          <Svg id="dots" width={18} height={4} />
          <StyledActions className="cell-actions">
            {actions.map(({ icon, disabled = false, action }, i) => (
              <StyledActionButton disabled={disabled} key={i} onClick={() => action(item)}>
                {icon}
              </StyledActionButton>
            ))}
          </StyledActions>
        </>
      </StyledCell>
    </TableRow>
  );
};
