import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from 'layouts/Footer';
import { LeftBar, TopBar } from 'components';
import { DuplicatePopups, DeletePopup, TransferOwnershipPopup } from 'components/Popups';
import { account, users, folders, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';

import { StyledBaseLayout, StyledCol } from './BaseLayout.styles';

export const BaseLayout = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const accountData = account.useData();
  const { duplicatePopupsVisible, deletePopupVisible, transferOwnershipPopupVisible } =
    popups.useData();

  useEffect(() => {
    dispatch(users.thunk.getManagersList());
    dispatch(users.thunk.getUsersList());
  }, [dispatch]);

  useEffect(() => {
    if (accountData?.account) {
      dispatch(folders.thunk.getAppletsForFolders({ account: accountData.account }));
    }
  }, [dispatch, accountData?.account]);

  return (
    <StyledBaseLayout>
      <LeftBar />
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
