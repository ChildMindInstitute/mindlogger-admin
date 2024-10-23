import { useState, DragEvent, useContext, useRef } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { TableRow } from '@mui/material';

import { setFolderApi, setAppletEncryptionApi, togglePinApi } from 'api';
import { useAsync, useTimeAgo } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import { auth, popups, workspaces } from 'redux/modules';
import { StyledBodyMedium, theme } from 'shared/styles';
import { Pin, AppletImage, ActionsMenu } from 'shared/components';
import {
  AppletPasswordPopup,
  AppletPasswordPopupType,
  AppletPasswordRefType,
} from 'modules/Dashboard/features/Applet/Popups';
import { page } from 'resources';
import {
  Encryption,
  falseReturnFunc,
  getBuilderAppletUrl,
  getDateInUserTimezone,
  getEncryptionToServer,
  Mixpanel,
  MixpanelEventType,
  MixpanelProps,
} from 'shared/utils';
import { useAppletsDnd } from 'modules/Dashboard/features/Applets/AppletsTable/AppletsTable.hooks';
import { ShareAppletPopup } from 'modules/Dashboard/features/Applets/Popups';
import { AppletsContext } from 'modules/Dashboard/features/Applets/Applets.context';
import { AppletContextType } from 'modules/Dashboard/features/Applets/Applets.types';
import { AppletsColumnsWidth } from 'modules/Dashboard/features/Applets/Applets.const';
import { useAppletPrivateKeySetter } from 'modules/Builder/hooks';

import { StyledTableCell } from '../AppletsTable.styles';
import { getTableRowClassNames } from '../AppletsTable.utils';
import { StyledAppletName, StyledPinContainer } from './AppletItem.styles';
import { getAppletActions, hasOwnerRole } from './AppletItem.utils';
import { AppletItemProps } from './AppletItem.types';

export const AppletItem = ({ item, onPublish, enableShareToLibrary }: AppletItemProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const timeAgo = useTimeAgo();
  const { ownerId } = workspaces.useData() || {};
  const userData = auth.useData();
  const { id: accountId } = userData?.user || {};
  const workspaceRoles = workspaces.useRolesData();
  const appletId = item.id;
  const overviewPath = generatePath(page.appletOverview, { appletId });
  const participantPath = generatePath(page.appletParticipants, { appletId });

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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
  const [_, setHasVisibleActions] = useState(false);

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

  const handleAppletClick = () => checkAppletEncryption(() => navigate(overviewPath));

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
    Mixpanel.track({
      action: MixpanelEventType.AppletCreatedSuccessfully,
      [MixpanelProps.AppletId]: appletId,
    });
  };

  const checkAppletEncryption = (callback: () => void) => {
    const itHasOwnerRole = hasOwnerRole(workspaceRoles?.data?.[appletId]?.[0]);

    return itHasOwnerRole && !item.encryption ? setPasswordPopupVisible(true) : callback();
  };

  const actions = {
    removeFromFolder: async () => {
      await setFolder({ appletId });
      await fetchData();
    },
    viewUsers: () => checkAppletEncryption(() => navigate(participantPath)),
    viewCalendar: () =>
      checkAppletEncryption(() => {
        navigate(APPLET_SCHEDULE);
        Mixpanel.track({
          action: MixpanelEventType.ViewGeneralCalendarClick,
          [MixpanelProps.AppletId]: appletId,
        });
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
        Mixpanel.track({
          action: MixpanelEventType.AppletEditClick,
          [MixpanelProps.AppletId]: appletId,
        });
      }),
  };

  return (
    <>
      <TableRow
        className={getTableRowClassNames({ hasHover: true, isDragOver })}
        draggable
        onDragStart={onDragStart}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDragEnd={(event) => onDragEnd(event, item)}
        onDrop={(event) => onDrop(event, item)}
        onMouseEnter={() => setHasVisibleActions(true)}
        onMouseLeave={() => setHasVisibleActions(false)}
        data-testid="dashboard-applets-table-applet-row"
      >
        <StyledTableCell width={AppletsColumnsWidth.AppletName} onClick={handleAppletClick}>
          <StyledAppletName applet={item}>
            {item.parentId && (
              <StyledPinContainer>
                <Pin
                  isPinned={item?.isPinned}
                  data-testid="dashboard-applets-pin"
                  onClick={(event) => {
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
          <ActionsMenu
            menuItems={getAppletActions({
              actions,
              item,
              roles: workspaceRoles?.data?.[appletId],
              enableShareToLibrary,
            })}
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
