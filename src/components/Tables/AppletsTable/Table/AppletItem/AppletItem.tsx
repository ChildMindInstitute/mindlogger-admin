import { useState, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableCell, TableRow } from '@mui/material';

import { useAppletsDnd, useTimeAgo } from 'hooks';
import { useAppDispatch } from 'redux/store';
import { FolderApplet, folders, popups } from 'redux/modules';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { Pin, Actions } from 'components';
import { ShareAppletPopup } from 'components/Popups/ShareAppletPopup';
import { APPLET_PAGES } from 'consts';

import { AppletImage } from '../AppletImage';
import { StyledAppletName, StyledPinContainer } from './AppletItem.styles';
import { getActions } from './AppletItem.const';

export const AppletItem = ({ item }: { item: FolderApplet }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const timeAgo = useTimeAgo();
  const { isDragOver, onDragLeave, onDragOver, onDrop } = useAppletsDnd();
  const [sharePopupVisible, setSharePopupVisible] = useState(false);

  const handleAppletClick = (id: string | undefined) => {
    if (id) navigate(`/${id}/${APPLET_PAGES.respondents}`);
  };

  const onDragStart = (event: DragEvent<HTMLTableRowElement>) => {
    event.persist();
    event.dataTransfer.setData('text/plain', item.id);
  };

  const actions = {
    viewUsers: () => navigate(`/${item.id}/${APPLET_PAGES.respondents}`),
    viewCalendar: () => navigate(`/${item.id}/${APPLET_PAGES.schedule}`),
    deleteAction: () =>
      dispatch(
        popups.actions.setPopupVisible({
          appletId: item.id,
          key: 'deletePopupVisible',
          value: true,
        }),
      ),
    duplicateAction: () =>
      dispatch(
        popups.actions.setPopupVisible({
          appletId: item.id,
          key: 'duplicatePopupsVisible',
          value: true,
        }),
      ),
    transferOwnership: () =>
      dispatch(
        popups.actions.setPopupVisible({
          appletId: item.id,
          key: 'transferOwnershipPopupVisible',
          value: true,
        }),
      ),
    shareAppletAction: () => setSharePopupVisible(true),
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
            <StyledBodyMedium>{item.name}</StyledBodyMedium>
          </StyledAppletName>
        </TableCell>
        <TableCell width="20%" onClick={() => handleAppletClick(item.id)}>
          {item.updated ? timeAgo.format(new Date(item.updated)) : ''}
        </TableCell>
        <TableCell>
          <Actions items={getActions(actions)} context={item} />
        </TableCell>
      </TableRow>
      {sharePopupVisible && (
        <ShareAppletPopup
          sharePopupVisible={sharePopupVisible}
          setSharePopupVisible={setSharePopupVisible}
          applet={item}
        />
      )}
    </>
  );
};
