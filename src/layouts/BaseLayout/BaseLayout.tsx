import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { LeftBar, TopBar, Footer } from 'components';
import { DuplicatePopups, DeletePopup, TransferOwnershipPopup } from 'features/Applet/Popups';
import { auth, account, users, folders, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';

import { StyledBaseLayout, StyledCol } from './BaseLayout.styles';

export const BaseLayout = () => {
  const dispatch = useAppDispatch();
  const isAuthorized = auth.useAuthorized();
  const accountData = account.useData();
  const { duplicatePopupsVisible, deletePopupVisible, transferOwnershipPopupVisible } =
    popups.useData();

  useEffect(() => {
    if (isAuthorized) {
      dispatch(users.thunk.getManagersList());
      dispatch(users.thunk.getUsersList());
    }
  }, [dispatch, isAuthorized]);

  useEffect(() => {
    if (accountData?.account && isAuthorized) {
      dispatch(folders.thunk.getAppletsForFolders({ account: accountData.account }));
    }
  }, [dispatch, accountData?.account, isAuthorized]);

  return (
    <StyledBaseLayout>
      {isAuthorized && <LeftBar />}
      <StyledCol>
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
