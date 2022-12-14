import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableCell, TableRow } from '@mui/material';

import { useAppletsDnd, useTimeAgo } from 'hooks';
import { useAppDispatch } from 'redux/store';
import { FolderApplet, folders } from 'redux/modules';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { Actions } from 'components/Actions';
import { Pin } from 'components/Pin';
import { appletPages } from 'utils/constants';

import { AppletImage } from '../AppletImage';
import { StyledAppletName, StyledPinContainer } from './AppletItem.styles';
import { actionsRender } from './AppletItem.const';
import { DeletePopUp } from './DeletePopUp';

export const AppletItem = ({ item }: { item: FolderApplet }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const timeAgo = useTimeAgo();
  const { isDragOver, onDragLeave, onDragOver, onDrop } = useAppletsDnd();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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
      <DeletePopUp
        deleteModalVisible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        item={item}
      />
    </>
  );
};
