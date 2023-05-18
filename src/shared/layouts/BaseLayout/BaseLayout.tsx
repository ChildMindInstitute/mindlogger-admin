import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import {
  DuplicatePopups,
  PublishConcealAppletPopup,
  TransferOwnershipPopup,
} from 'modules/Dashboard/features/Applet/Popups';
import { useAppDispatch } from 'redux/store';
import { popups, workspaces, users, auth, folders } from 'redux/modules';
import { DEFAULT_ROWS_PER_PAGE, Footer } from 'shared/components';

import { DeletePopup, LeftBar, TopBar } from './components';
import { StyledBaseLayout, StyledCol } from './BaseLayout.styles';

export const BaseLayout = () => {
  const { appletId } = useParams();
  const dispatch = useAppDispatch();
  const isAuthorized = auth.useAuthorized();
  const { ownerId } = workspaces.useData() || {};
  const {
    duplicatePopupsVisible,
    deletePopupVisible,
    transferOwnershipPopupVisible,
    publishConcealPopupVisible,
  } = popups.useData();

  useEffect(() => {
    const { getFolders, getWorkspaceApplets } = folders.thunk;
    const { getWorkspaceRespondents, getWorkspaceManagers } = users.thunk;
    const { getWorkspacePriorityRole } = workspaces.thunk;

    if (ownerId) {
      dispatch(
        getWorkspacePriorityRole({
          params: {
            ownerId,
            ...(appletId && { appletIDs: [appletId] }),
          },
        }),
      );
      dispatch(
        getWorkspaceRespondents({
          params: {
            ownerId,
            limit: DEFAULT_ROWS_PER_PAGE,
            ...(appletId && { appletId }),
          },
        }),
      );
      dispatch(
        getWorkspaceManagers({
          params: {
            ownerId,
            limit: DEFAULT_ROWS_PER_PAGE,
            ...(appletId && { appletId }),
          },
        }),
      );
      (async () => {
        await dispatch(getFolders({ ownerId }));
        dispatch(
          getWorkspaceApplets({
            params: {
              ownerId,
              limit: DEFAULT_ROWS_PER_PAGE,
            },
          }),
        );
      })();
    }
  }, [dispatch, ownerId, appletId]);

  return (
    <StyledBaseLayout>
      {isAuthorized && <LeftBar />}
      <StyledCol isAuthorized={isAuthorized}>
        <TopBar />
        <Outlet />
        <Footer />
      </StyledCol>
      {duplicatePopupsVisible && <DuplicatePopups />}
      {deletePopupVisible && <DeletePopup />}
      {transferOwnershipPopupVisible && <TransferOwnershipPopup />}
      {publishConcealPopupVisible && <PublishConcealAppletPopup />}
    </StyledBaseLayout>
  );
};
