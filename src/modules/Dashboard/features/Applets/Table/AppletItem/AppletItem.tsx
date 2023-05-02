import { useState, DragEvent } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { TableCell, TableRow } from '@mui/material';

import { useAppletsDnd, useTimeAgo } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import { FolderApplet, folders, popups, account } from 'redux/modules';
import { StyledBodyMedium } from 'shared/styles';
import { Pin, Actions, AppletImage } from 'shared/components';
import { AppletPasswordPopup, AppletPasswordPopupType } from 'modules/Dashboard/features/Applet';
import { page } from 'resources';
import { getAppletEncryptionInfo } from 'shared/utils/encryption';
import { getBuilderAppletUrl, getDateInUserTimezone } from 'shared/utils';

import { ShareAppletPopup } from '../../Popups';
import { StyledAppletName, StyledPinContainer } from './AppletItem.styles';
import { getActions } from './AppletItem.utils';

export const AppletItem = ({ item }: { item: FolderApplet }) => {
  const accountData = account.useData();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const timeAgo = useTimeAgo();
  const { isDragOver, onDragLeave, onDragOver, onDrop } = useAppletsDnd();
  const [sharePopupVisible, setSharePopupVisible] = useState(false);
  const [passwordPopupVisible, setPasswordPopupVisible] = useState(false);

  const APPLET_RESPONDENTS = generatePath(page.appletRespondents, {
    appletId: item.id,
  });
  const APPLET_SCHEDULE = generatePath(page.appletSchedule, {
    appletId: item.id,
  });

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
    editAction: () => {
      if (item.isFolder) return; // TODO: add Edit Folder Page navigation

      navigate(getBuilderAppletUrl(item.id));
    },
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
          {item.updatedAt ? timeAgo.format(getDateInUserTimezone(item.updatedAt)) : ''}
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
      {passwordPopupVisible && (
        <AppletPasswordPopup
          appletId={item.id}
          popupVisible={passwordPopupVisible}
          onClose={() => setPasswordPopupVisible(false)}
          popupType={AppletPasswordPopupType.Create}
          submitCallback={submitCallback}
        />
      )}
    </>
  );
};
