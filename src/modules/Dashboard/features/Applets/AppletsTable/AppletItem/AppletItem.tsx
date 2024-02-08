import { useState, DragEvent, useContext, useRef } from 'react';

import { TableRow } from '@mui/material';
import { generatePath, useNavigate } from 'react-router-dom';

import { setFolderApi, setAppletEncryptionApi, togglePinApi } from 'api';
import { useAppletPrivateKeySetter } from 'modules/Builder/hooks';
import {
  AppletPasswordPopup,
  AppletPasswordPopupType,
  AppletPasswordRefType,
} from 'modules/Dashboard/features/Applet/Popups';
import { AppletsColumnsWidth } from 'modules/Dashboard/features/Applets/Applets.const';
import { AppletsContext } from 'modules/Dashboard/features/Applets/Applets.context';
import { AppletContextType } from 'modules/Dashboard/features/Applets/Applets.types';
import { useAppletsDnd } from 'modules/Dashboard/features/Applets/AppletsTable/AppletsTable.hooks';
import { ShareAppletPopup } from 'modules/Dashboard/features/Applets/Popups';
import { auth, popups, workspaces } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { Pin, Actions, AppletImage } from 'shared/components';
import { useAsync, useTimeAgo } from 'shared/hooks';
import { StyledBodyMedium, theme } from 'shared/styles';
import {
  Encryption,
  falseReturnFunc,
  getBuilderAppletUrl,
  getDateInUserTimezone,
  getEncryptionToServer,
  Mixpanel,
} from 'shared/utils';

import { StyledTableCell } from '../AppletsTable.styles';
import { StyledAppletName, StyledPinContainer } from './AppletItem.styles';
import { AppletItemProps } from './AppletItem.types';
import { getActions, hasOwnerRole } from './AppletItem.utils';

export const AppletItem = ({ item, onPublish }: AppletItemProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const timeAgo = useTimeAgo();
  const { ownerId } = workspaces.useData() || {};
  const userData = auth.useData();
  const { id: accountId } = userData?.user || {};
  const workspaceRoles = workspaces.useRolesData();
  const appletId = item.id;
  const setAppletPrivateKey = useAppletPrivateKeySetter();
  const encryptionDataRef = useRef<{
    encryption?: Encryption;
    password?: string;
  }>({});

  const { fetchData } = useContext(AppletsContext) as AppletContextType;
  const { execute: setFolder } = useAsync(setFolderApi);
  const { execute: togglePin } = useAsync(togglePinApi);
  const { execute: setAppletEncryption } = useAsync(
    setAppletEncryptionApi,
    async () => {
      await setAppletPrivateKey({
        appletPassword: encryptionDataRef.current.password ?? '',
        encryption: encryptionDataRef.current.encryption!,
        appletId,
      });
    },
    falseReturnFunc,
    () => {
      encryptionDataRef.current = {};
    },
  );

  const { isDragOver, onDragLeave, onDragOver, onDrop, onDragEnd } = useAppletsDnd();
  const [sharePopupVisible, setSharePopupVisible] = useState(false);
  const [passwordPopupVisible, setPasswordPopupVisible] = useState(false);
  const [hasVisibleActions, setHasVisibleActions] = useState(false);

  const APPLET_RESPONDENTS = generatePath(page.appletRespondents, {
    appletId,
  });
  const APPLET_SCHEDULE = generatePath(page.appletSchedule, {
    appletId,
  });

  const handleTogglePin = async () => {
    if (!ownerId || !item.parentId) return;
    await togglePin({
      ownerId,
      appletId,
      folderId: item.parentId,
      isPinned: !item.isPinned,
    });
    await fetchData();
  };

  const handleAppletClick = () => checkAppletEncryption(() => navigate(APPLET_RESPONDENTS));

  const onDragStart = (event: DragEvent<HTMLTableRowElement>) => {
    event.persist();
    event.dataTransfer.setData('text/plain', appletId);
  };

  const submitCallback = async (ref?: AppletPasswordRefType) => {
    const password = ref?.current?.password ?? '';
    const encryption = await getEncryptionToServer(password, accountId ?? '');
    encryptionDataRef.current = {
      encryption,
      password,
    };
    await setAppletEncryption({
      appletId,
      encryption,
    });
    await fetchData();
    setPasswordPopupVisible(false);
    Mixpanel.track('Applet Created Successfully');
  };

  const checkAppletEncryption = (callback: () => void) =>
    hasOwnerRole(workspaceRoles?.data?.[appletId]?.[0]) && !item.encryption
      ? setPasswordPopupVisible(true)
      : callback();

  const actions = {
    removeFromFolder: async () => {
      await setFolder({ appletId });
      await fetchData();
    },
    viewUsers: () => checkAppletEncryption(() => navigate(APPLET_RESPONDENTS)),
    viewCalendar: () =>
      checkAppletEncryption(() => {
        navigate(APPLET_SCHEDULE);
        Mixpanel.track('View General calendar click');
      }),
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
        if (item.isFolder) return;

        navigate(getBuilderAppletUrl(appletId));
        Mixpanel.track('Applet edit click');
      }),
  };

  return (
    <>
      <TableRow
        className={isDragOver ? 'dragged-over' : ''}
        draggable
        onDragStart={onDragStart}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDragEnd={event => onDragEnd(event, item)}
        onDrop={event => onDrop(event, item)}
        hover
        onMouseEnter={() => setHasVisibleActions(true)}
        onMouseLeave={() => setHasVisibleActions(false)}>
        <StyledTableCell width={AppletsColumnsWidth.AppletName} onClick={handleAppletClick}>
          <StyledAppletName applet={item}>
            {item.parentId && (
              <StyledPinContainer>
                <Pin
                  isPinned={item?.isPinned}
                  data-testid="dashboard-applets-pin"
                  onClick={event => {
                    event.stopPropagation();
                    handleTogglePin();
                  }}
                />
              </StyledPinContainer>
            )}
            <AppletImage image={item.image} appletName={item.displayName} />
            <StyledBodyMedium sx={{ ml: theme.spacing(1.2) }}>{item.displayName}</StyledBodyMedium>
          </StyledAppletName>
        </StyledTableCell>
        <StyledTableCell width={AppletsColumnsWidth.LastEdit} onClick={handleAppletClick}>
          <StyledBodyMedium>
            {item.updatedAt ? timeAgo.format(getDateInUserTimezone(item.updatedAt)) : ''}
          </StyledBodyMedium>
        </StyledTableCell>
        <StyledTableCell>
          <Actions
            items={getActions({ actions, item, roles: workspaceRoles?.data?.[appletId] })}
            context={item}
            visibleByDefault={hasVisibleActions}
            data-testid="dashboard-applets-table-applet-actions"
          />
        </StyledTableCell>
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
          appletId={appletId}
          popupVisible={passwordPopupVisible}
          onClose={() => setPasswordPopupVisible(false)}
          popupType={AppletPasswordPopupType.Create}
          submitCallback={submitCallback}
          data-testid="dashboard-applets-password-popup"
        />
      )}
    </>
  );
};
