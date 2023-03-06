import { useState, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableCell, TableRow } from '@mui/material';

import { useAppletsDnd, useTimeAgo } from 'hooks';
import { useAppDispatch } from 'redux/store';
import { FolderApplet, folders, popups, account } from 'redux/modules';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { Pin, Actions } from 'components';
import { ShareAppletPopup } from 'modules/Dashboard/features/Applets/Popups';
import {
  //AppletPasswordPopup,
  AppletPasswordPopupType,
} from 'modules/Dashboard/features/Applet/Popups';
import { APPLET_PAGES } from 'consts';
import { page } from 'resources';
import { getAppletEncryptionInfo } from 'utils/encryption';

import { AppletImage } from '../AppletImage';
import { StyledAppletName, StyledPinContainer } from './AppletItem.styles';
import { getActions } from './AppletItem.const';

export const AppletItem = ({ item }: { item: FolderApplet }) => {
  const accountData = account.useData();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const timeAgo = useTimeAgo();
  const { isDragOver, onDragLeave, onDragOver, onDrop } = useAppletsDnd();
  const [sharePopupVisible, setSharePopupVisible] = useState(false);
  const [passwordPopupVisible, setPasswordPopupVisible] = useState(false);

  const APPLET_RESPONDENTS = `${page.dashboard}/${item.id}/${APPLET_PAGES.respondents}`;
  const APPLET_SCHEDULE = `${page.dashboard}/${item.id}/${APPLET_PAGES.schedule}`;

  const handleAppletClick = () => checkAppletEncryption(() => navigate(APPLET_RESPONDENTS));

  const onDragStart = (event: DragEvent<HTMLTableRowElement>) => {
    event.persist();
    event.dataTransfer.setData('text/plain', item.id);
  };

  const submitCallback = async ({ appletPassword }: { appletPassword: string }) => {
    const encryptionInfo = getAppletEncryptionInfo({
      appletPassword,
      accountId: accountData?.account.accountId || '',
    });
    const formData = new FormData();
    formData.set(
      'encryption',
      JSON.stringify({
        appletPublicKey: Array.from(encryptionInfo.getPublicKey()),
        appletPrime: Array.from(encryptionInfo.getPrime()),
        base: Array.from(encryptionInfo.getGenerator()),
      }),
    );

    await dispatch(
      folders.thunk.setAppletEncryption({
        appletId: item.id,
        data: formData,
      }),
    );

    setPasswordPopupVisible(false);
  };

  const checkAppletEncryption = (callback: () => void) =>
    item?.roles?.includes('owner') && !item?.encryption
      ? setPasswordPopupVisible(true)
      : callback();

  const actions = {
    removeFromFolder: () =>
      dispatch(
        folders.thunk.removeAppletFromFolder({
          applet: item,
        }),
      ),
    viewUsers: () => checkAppletEncryption(() => navigate(APPLET_RESPONDENTS)),
    viewCalendar: () => checkAppletEncryption(() => navigate(APPLET_SCHEDULE)),
    deleteAction: () =>
      checkAppletEncryption(() =>
        dispatch(
          popups.actions.setPopupVisible({
            appletId: item.id,
            key: 'deletePopupVisible',
            value: true,
          }),
        ),
      ),
    duplicateAction: () =>
      checkAppletEncryption(() =>
        dispatch(
          popups.actions.setPopupVisible({
            appletId: item.id,
            key: 'duplicatePopupsVisible',
            value: true,
          }),
        ),
      ),
    transferOwnership: () =>
      checkAppletEncryption(() =>
        dispatch(
          popups.actions.setPopupVisible({
            appletId: item.id,
            key: 'transferOwnershipPopupVisible',
            value: true,
          }),
        ),
      ),
    shareAppletAction: () => checkAppletEncryption(() => setSharePopupVisible(true)),
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
        <TableCell width="30%" onClick={handleAppletClick}>
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
            <StyledBodyMedium>{item.displayName}</StyledBodyMedium>
          </StyledAppletName>
        </TableCell>
        <TableCell width="20%" onClick={handleAppletClick}>
          {item.updatedAt ? timeAgo.format(new Date(item.updatedAt)) : ''}
        </TableCell>
        <TableCell>
          <Actions items={getActions({ actions, item })} context={item} />
        </TableCell>
      </TableRow>
      {sharePopupVisible && (
        <ShareAppletPopup
          sharePopupVisible={sharePopupVisible}
          setSharePopupVisible={setSharePopupVisible}
          applet={item}
        />
      )}
      {/* {passwordPopupVisible && (
        <AppletPasswordPopup
          popupVisible={passwordPopupVisible}
          onClose={() => setPasswordPopupVisible(false)}
          popupType={AppletPasswordPopupType.Create}
          submitCallback={submitCallback}
        />
      )} */}
    </>
  );
};
