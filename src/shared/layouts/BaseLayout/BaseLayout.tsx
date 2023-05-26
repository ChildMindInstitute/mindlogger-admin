import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import {
  DuplicatePopups,
  PublishConcealAppletPopup,
  TransferOwnershipPopup,
} from 'modules/Dashboard/features/Applet/Popups';
import { useAppDispatch } from 'redux/store';
import { popups, workspaces, auth } from 'redux/modules';
import { Footer } from 'shared/components';

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
    if (!ownerId) return;
    const { getWorkspaceRoles } = workspaces.thunk;

    dispatch(
      getWorkspaceRoles({
        ownerId,
      }),
    );
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
