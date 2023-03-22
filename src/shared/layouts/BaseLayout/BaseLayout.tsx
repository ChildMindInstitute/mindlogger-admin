import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import {
  DuplicatePopups,
  DeletePopup,
  TransferOwnershipPopup,
} from 'modules/Dashboard/features/Applet/Popups';
import { useAppDispatch } from 'redux/store';
import { auth } from 'modules/Auth/state';
import { account, folders, popups, users } from 'modules/Dashboard/state';
import { Footer } from 'shared/components';

import { LeftBar, TopBar } from './components';
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
