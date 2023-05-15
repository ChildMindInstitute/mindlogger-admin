import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { DuplicatePopups, TransferOwnershipPopup } from 'modules/Dashboard/features/Applet/Popups';
import { useAppDispatch } from 'redux/store';
import { popups, workspaces, users, auth, folders } from 'redux/modules';
import { DEFAULT_ROWS_PER_PAGE, Footer } from 'shared/components';

import { DeletePopup, LeftBar, TopBar } from './components';
import { StyledBaseLayout, StyledCol } from './BaseLayout.styles';

export const BaseLayout = () => {
  const { appletId: id } = useParams();
  const dispatch = useAppDispatch();
  const isAuthorized = auth.useAuthorized();
  const appletsFolders = folders.useFolders();
  const { ownerId } = workspaces.useData() || {};
  const { duplicatePopupsVisible, deletePopupVisible, transferOwnershipPopupVisible } =
    popups.useData();

  useEffect(() => {
    if (appletsFolders.length && isAuthorized && ownerId) {
      dispatch(
        folders.thunk.getWorkspaceApplets({
          params: {
            ownerId,
            limit: DEFAULT_ROWS_PER_PAGE,
          },
        }),
      );
    }
  }, [isAuthorized, appletsFolders, ownerId]);

  useEffect(() => {
    const { getFolders } = folders.thunk;
    const { getWorkspaceRespondents, getWorkspaceManagers } = users.thunk;

    if (ownerId) {
      dispatch(getFolders());
      dispatch(
        getWorkspaceRespondents({
          params: {
            ownerId,
            limit: DEFAULT_ROWS_PER_PAGE,
            ...(id && { appletId: id }),
          },
        }),
      );
      dispatch(
        getWorkspaceManagers({
          params: {
            ownerId,
            limit: DEFAULT_ROWS_PER_PAGE,
            ...(id && { appletId: id }),
          },
        }),
      );
    }
  }, [dispatch, ownerId, id]);

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
