import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TableCell, TableRow } from '@mui/material';
import { Box } from '@mui/system';

import { useAppletsDnd, useTimeAgo } from 'hooks';
import { useAsync } from 'hooks/useAsync';
import { useAppDispatch } from 'redux/store';
import { account, FolderApplet, folders } from 'redux/modules';
import { StyledBodyMedium, StyledHeadline } from 'styles/styledComponents/Typography';
import { StyledModalBtn, StyledModalText, StyledModalWrapper } from 'styles/styledComponents/Modal';
import { Actions } from 'components/Actions';
import { Pin } from 'components/Pin';
import { BasicPopUp } from 'components/Popups/BasicPopUp';
import { appletPages } from 'utils/constants';
import { deleteAppletApi } from 'api';

import { AppletImage } from '../AppletImage';
import { StyledAppletName, StyledPinContainer } from './AppletItem.styles';
import { actionsRender } from './AppletItem.const';

export const AppletItem = ({ item }: { item: FolderApplet }) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const timeAgo = useTimeAgo();
  const accountData = account.useData();
  const { isDragOver, onDragLeave, onDragOver, onDrop } = useAppletsDnd();
  const { execute, error } = useAsync(() => deleteAppletApi({ appletId: item.id || '' }));
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const deleteModalClose = () => setDeleteModalVisible(false);

  const handleDeleteApplet = async () => {
    await execute();

    !error &&
      dispatch(account.thunk.switchAccount({ accountId: accountData?.account.accountId || '' }));
    deleteModalClose();
  };

  const handleAppletClick = (id: string | undefined) => {
    if (id) navigate(`/${id}/${appletPages.respondents}`);
  };

  const onDragStart = (event: React.DragEvent<HTMLTableRowElement>) => {
    event.persist();
    event.dataTransfer.setData('text/plain', item.id);
  };

  const actions = {
    deleteAction: () => setDeleteModalVisible(true),
  };

  return (
    <>
      <TableRow
        className={isDragOver ? 'dragged-over' : ''}
        draggable
        onDragStart={onDragStart}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, item)}
      >
        <TableCell width="30%" onClick={() => handleAppletClick(item.id)}>
          <StyledAppletName applet={item}>
            {item.parentId && (
              <StyledPinContainer>
                <Pin
                  isPinned={!!item?.pinOrder}
                  onClick={(e) => {
                    dispatch(folders.thunk.togglePin(item));
                    e.stopPropagation();
                  }}
                />
              </StyledPinContainer>
            )}
            <AppletImage image={item.image} appletName={item.name} />
            <StyledBodyMedium fontWeight={'medium'}>{item.name}</StyledBodyMedium>
          </StyledAppletName>
        </TableCell>
        <TableCell width="20%" onClick={() => handleAppletClick(item.id)}>
          {item.updated ? timeAgo.format(new Date(item.updated)) : ''}
        </TableCell>
        <TableCell>
          <Actions items={actionsRender(actions)} context={item} />
        </TableCell>
      </TableRow>
      <BasicPopUp open={deleteModalVisible} handleClose={deleteModalClose}>
        <StyledModalWrapper>
          <StyledHeadline>{t('deleteApplet')}</StyledHeadline>
          <StyledModalText>{t('confirmDeleteApplet')}</StyledModalText>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <StyledModalBtn variant="text" onClick={handleDeleteApplet}>
              {t('yes')}
            </StyledModalBtn>
            <StyledModalBtn variant="text" onClick={deleteModalClose}>
              {t('no')}
            </StyledModalBtn>
          </Box>
        </StyledModalWrapper>
      </BasicPopUp>
    </>
  );
};
