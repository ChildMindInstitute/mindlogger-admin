import { useState, DragEvent, useContext } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { TableCell } from '@mui/material';

import { setFolderApi, setAppletEncryptionApi, togglePinApi } from 'api';
import { useAsync, useTimeAgo } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import { popups, workspaces } from 'redux/modules';
import { StyledBodyMedium } from 'shared/styles';
import { Pin, Actions, AppletImage } from 'shared/components';
import { AppletPasswordPopup, AppletPasswordPopupType } from 'modules/Dashboard/features/Applet';
import { page } from 'resources';
import { Encryption, getBuilderAppletUrl, getDateInUserTimezone } from 'shared/utils';
import { useAppletsDnd } from 'modules/Dashboard/features/Applets/Table/Table.hooks';
import { ShareAppletPopup } from 'modules/Dashboard/features/Applets/Popups';
import { AppletsContext } from 'modules/Dashboard/features/Applets/Applets';
import { AppletContextType } from 'modules/Dashboard/features/Applets/Applets.types';

import { StyledAppletName, StyledPinContainer, StyledTableRow } from './AppletItem.styles';
import { getActions, hasOwnerRole } from './AppletItem.utils';
import { AppletItemProps } from './AppletItem.types';

export const AppletItem = ({ item, onPublish }: AppletItemProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const timeAgo = useTimeAgo();
  const { ownerId } = workspaces.useData() || {};
  const workspaceRoles = workspaces.useRolesData();

  const { fetchData } = useContext(AppletsContext) as AppletContextType;

  const { execute: setFolder } = useAsync(setFolderApi);
  const { execute: togglePin } = useAsync(togglePinApi);
  const { execute: setAppletEncryption } = useAsync(setAppletEncryptionApi);

  const { isDragOver, onDragLeave, onDragOver, onDrop, onDragEnd } = useAppletsDnd();
  const [sharePopupVisible, setSharePopupVisible] = useState(false);
  const [passwordPopupVisible, setPasswordPopupVisible] = useState(false);
  const [hasVisibleActions, setHasVisibleActions] = useState(false);

  const APPLET_RESPONDENTS = generatePath(page.appletRespondents, {
    appletId: item.id,
  });
  const APPLET_SCHEDULE = generatePath(page.appletSchedule, {
    appletId: item.id,
  });

  const handleTogglePin = async () => {
    if (!ownerId || !item.parentId) return;
    await togglePin({
      ownerId,
      appletId: item.id,
      folderId: item.parentId,
      isPinned: !item.pinnedAt,
    });
    await fetchData();
  };

  const handleAppletClick = () => checkAppletEncryption(() => navigate(APPLET_RESPONDENTS));

  const onDragStart = (event: DragEvent<HTMLTableRowElement>) => {
    event.persist();
    event.dataTransfer.setData('text/plain', item.id);
  };

  const submitCallback = async (encryption: Encryption) => {
    await setAppletEncryption({
      appletId: item.id,
      encryption,
    });
    await fetchData();
    setPasswordPopupVisible(false);
  };

  const checkAppletEncryption = (callback: () => void) =>
    hasOwnerRole(workspaceRoles?.data?.[item.id]?.[0]) && !item.encryption
      ? setPasswordPopupVisible(true)
      : callback();

  const actions = {
    removeFromFolder: async () => {
      await setFolder({ appletId: item.id });
      await fetchData();
    },
    viewUsers: () => checkAppletEncryption(() => navigate(APPLET_RESPONDENTS)),
    viewCalendar: () => checkAppletEncryption(() => navigate(APPLET_SCHEDULE)),
    deleteAction: () =>
      checkAppletEncryption(() =>
        dispatch(
          popups.actions.setPopupVisible({
            applet: item,
            key: 'deletePopupVisible',
            value: true,
          }),
        ),
      ),
    duplicateAction: () =>
      checkAppletEncryption(() =>
        dispatch(
          popups.actions.setPopupVisible({
            applet: item,
            key: 'duplicatePopupsVisible',
            value: true,
          }),
        ),
      ),
    transferOwnership: () =>
      checkAppletEncryption(() =>
        dispatch(
          popups.actions.setPopupVisible({
            applet: item,
            key: 'transferOwnershipPopupVisible',
            value: true,
          }),
        ),
      ),
    shareAppletAction: () => checkAppletEncryption(() => setSharePopupVisible(true)),
    publishAppletAction: () => {
      if (item.isFolder) return;

      dispatch(
        popups.actions.setPopupVisible({
          applet: item,
          key: 'publishConcealPopupVisible',
          value: true,
          popupProps: {
            onSuccess: onPublish,
          },
        }),
      );
    },
    editAction: () =>
      checkAppletEncryption(() => {
        if (item.isFolder) return; // TODO: add Edit Folder Page navigation

        navigate(getBuilderAppletUrl(item.id));
      }),
  };

  return (
    <>
      <StyledTableRow
        className={isDragOver ? 'dragged-over' : ''}
        draggable
        onDragStart={onDragStart}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDragEnd={(event) => onDragEnd(event, item)}
        onDrop={(event) => onDrop(event, item)}
        hover
        onMouseEnter={() => setHasVisibleActions(true)}
        onMouseLeave={() => setHasVisibleActions(false)}
      >
        <TableCell width="30%" onClick={handleAppletClick}>
          <StyledAppletName applet={item}>
            {item.parentId && (
              <StyledPinContainer>
                <Pin
                  isPinned={!!item?.pinnedAt}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleTogglePin();
                  }}
                />
              </StyledPinContainer>
            )}
            <AppletImage image={item.image} appletName={item.displayName} />
            <StyledBodyMedium>{item.displayName}</StyledBodyMedium>
          </StyledAppletName>
        </TableCell>
        <TableCell width="20%" onClick={handleAppletClick}>
          <StyledBodyMedium>
            {item.updatedAt ? timeAgo.format(getDateInUserTimezone(item.updatedAt)) : ''}
          </StyledBodyMedium>
        </TableCell>
        <TableCell>
          <Actions
            items={getActions({ actions, item, roles: workspaceRoles?.data?.[item.id] })}
            context={item}
            visibleByDefault={hasVisibleActions}
          />
        </TableCell>
      </StyledTableRow>
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
