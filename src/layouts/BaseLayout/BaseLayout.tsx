import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { LeftBar } from 'components/LeftBar';
import { TopBar } from 'components/TopBar';
import { Footer } from 'layouts/Footer';
import { account, users, folders } from 'redux/modules';
import { useAppDispatch } from 'redux/store';

import { StyledBaseLayout, StyledCol } from './BaseLayout.styles';

export const BaseLayout = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const accountData = account.useData();

  useEffect(() => {
    dispatch(users.thunk.getManagersList());
    dispatch(users.thunk.getUsersList());
  }, [dispatch]);

  useEffect(() => {
    if (accountData?.account) {
      dispatch(folders.thunk.getAppletsForFolders({ account: accountData?.account }));
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
    </StyledBaseLayout>
  );
};
