import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { DuplicatePopups, TransferOwnershipPopup } from 'modules/Dashboard/features/Applet/Popups';
import { useAppDispatch } from 'redux/store';
import { account, folders, popups, workspaces, applets, users, auth } from 'redux/modules';
import { DEFAULT_ROWS_PER_PAGE, Footer } from 'shared/components';

import { DeletePopup, LeftBar, TopBar } from './components';
import { StyledBaseLayout, StyledCol } from './BaseLayout.styles';

export const BaseLayout = () => {
  const { appletId } = useParams();
  const dispatch = useAppDispatch();
  const isAuthorized = auth.useAuthorized();
  const accountData = account.useData();
  const { ownerId } = workspaces.useData() || {};
  const { duplicatePopupsVisible, deletePopupVisible, transferOwnershipPopupVisible } =
    popups.useData();

  useEffect(() => {
    if (accountData?.account && isAuthorized) {
      dispatch(folders.thunk.getAppletsForFolders({ account: accountData.account }));
    }
  }, [dispatch, accountData?.account, isAuthorized]);

  useEffect(() => {
    const { getWorkspaceApplets } = applets.thunk;
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
        getWorkspaceApplets({
          params: {
            ownerId,
            limit: DEFAULT_ROWS_PER_PAGE,
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
    </StyledBaseLayout>
  );
};
