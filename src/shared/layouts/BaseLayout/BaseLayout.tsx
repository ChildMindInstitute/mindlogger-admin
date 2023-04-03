import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import {
  DuplicatePopups,
  DeletePopup,
  TransferOwnershipPopup,
} from 'modules/Dashboard/features/Applet/Popups';
import { useAppDispatch } from 'redux/store';
import { account, folders, popups, workspaces, applets, users, auth } from 'redux/modules';
import { OrderBy } from 'shared/types';
import { DEFAULT_ROWS_PER_PAGE, Footer } from 'shared/components';
import { Roles } from 'shared/consts';

import { LeftBar, TopBar } from './components';
import { StyledBaseLayout, StyledCol } from './BaseLayout.styles';

export const BaseLayout = () => {
  const dispatch = useAppDispatch();
  const isAuthorized = auth.useAuthorized();
  const accountData = account.useData();
  const currentWorkspaceData = workspaces.useData();
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
    const ownerId = currentWorkspaceData?.ownerId;

    if (ownerId) {
      dispatch(
        getWorkspaceApplets({
          params: {
            ownerId,
            limit: DEFAULT_ROWS_PER_PAGE,
            ordering: `-${OrderBy.UpdatedAt}`,
          },
        }),
      );
      dispatch(
        getWorkspaceRespondents({
          params: {
            ownerId: currentWorkspaceData.ownerId,
            limit: DEFAULT_ROWS_PER_PAGE,
            ordering: `-${OrderBy.UpdatedAt}`,
            role: Roles.Respondent,
          },
        }),
      );
      dispatch(
        getWorkspaceManagers({
          params: {
            ownerId: currentWorkspaceData.ownerId,
            limit: DEFAULT_ROWS_PER_PAGE,
            ordering: `-${OrderBy.UpdatedAt}`,
            role: Roles.Manager,
          },
        }),
      );
    }
  }, [dispatch, currentWorkspaceData]);

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
